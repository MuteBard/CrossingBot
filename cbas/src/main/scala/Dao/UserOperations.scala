
package Dao
import Auxillary.Time.log
import Model.Fish_.Fish
import akka.stream.alpakka.mongodb.scaladsl.{MongoSink, MongoSource}
import akka.stream.scaladsl.{Flow, Sink, Source}
import org.bson.codecs.configuration.CodecRegistries.{fromProviders, fromRegistries}
import org.mongodb.scala.MongoClient.DEFAULT_CODEC_REGISTRY
import org.mongodb.scala.bson.codecs.Macros._
import akka.stream.alpakka.mongodb.DocumentUpdate
import org.mongodb.scala.model.{Filters, Updates}

import scala.util.{Failure, Success}
import Actors.Initializer.system
import Model.Bug_._
import Model.TurnipTransaction_._
import Model.User_._
import Model.Pocket_._
import scala.language.postfixOps

import scala.concurrent.duration._
import scala.concurrent.{Await, Future}
import system.dispatcher


object UserOperations extends MongoDBOperations {
	final val BUG = "bug"
	final val FISH = "fish"
	final val chill = 10
	val codecRegistryUser = fromRegistries(fromProviders(classOf[User], classOf[TurnipTransaction],classOf[Pocket], classOf[Bug], classOf[Fish]), DEFAULT_CODEC_REGISTRY)
	val codecRegistryPocket = fromRegistries(fromProviders(classOf[User],classOf[Pocket], classOf[Bug], classOf[Fish]), DEFAULT_CODEC_REGISTRY)

	private val allUsers = db
		.getCollection("user", classOf[User])
		.withCodecRegistry(codecRegistryUser)

	def createOneUser(user : User): Unit = {
		val source = Source(List(user))
		val taskFuture = source.runWith(MongoSink.insertOne(allUsers))
		taskFuture.onComplete{
			case Success(_) => log.info("UserOperations","createOneUser","Success",s"Added USER ${user.username}")
			case Failure (ex) => log.warn("UserOperations","createOneUser","Failure",s"Failed to create USER: $ex")
		}
	}

	def finalizeCreateOneUser(username : String, id : Int, avatar : String): Unit = {
		genericUpdateUser(username, "id", id)
		genericUpdateUser(username, "avatar", avatar)
		log.info("UserOperations","finalizeCreateOneUser","Success",s"Updated $username's id and avatar")
	}

	def readOneUser(username : String): Seq[User] = {
		val source = MongoSource(allUsers.find(classOf[User])).filter(users => users.username == username)
		val userSeqFuture = source.runWith(Sink.seq)
		val userSeq : Seq[User] = Await.result(userSeqFuture, chill seconds)
		userSeq
	}

	def readAllChannelsWithCrossingBotAdded() : Seq[User] = {
		val source = MongoSource(allUsers.find(classOf[User])).filter(users => users.addedToChannel)
		val userSeqFuture = source.runWith(Sink.seq)
		val userSeq : Seq[User] = Await.result(userSeqFuture, chill seconds)
		userSeq
	}

	def updateUserChannelsWithCrossingBotAdded(username: String, added  : Boolean) : Unit = {
		val source = MongoSource(allUsers.find(classOf[User]))
			.map(user => {
				DocumentUpdate(filter = Filters.eq("username", user.username), update = Updates.set("addedToChannel", added ))
			})
		val taskFuture = source.runWith(MongoSink.updateOne(allUsers))
		taskFuture.onComplete {
			case Success(_) =>
				log.info("UserOperations", "updateUserPocket", "Success", s"Updated CrossingBot presence for $username's channel")
			case Failure(ex) =>
				log.warn("UserOperations", "updateUserPocket", "Failure", s"Failed to update CrossingBot presence for $username's channel: $ex")
		}
	}

	def updateUserPocket(user : User, species: String, pocketedCreature: Pocket ) : Unit = {
		val source = MongoSource(allUsers.find(classOf[User]))
			.map(user => {
				val updatedPocket = newPocket(user.pocket, species, pocketedCreature)
				DocumentUpdate(filter = Filters.eq("username", user.username), update = Updates.set("pocket", updatedPocket))
			})
		val taskFuture = source.runWith(MongoSink.updateOne(allUsers))
		taskFuture.onComplete{
			case Success(_) =>
				log.info("UserOperations","updateUserPocket","Success",s"Updated ${user.username}'s pocket successfully")
			case Failure (ex) =>
				log.warn("UserOperations","updateUserPocket","Failure",s"Failed update: $ex")
		}
	}

	def newPocket(userPocket: Pocket, species : String, pocketedCreature : Pocket): Pocket = {
		if(species == "bug"){
			val newBugList = userPocket.bug :+ pocketedCreature.bug.head
			Pocket(newBugList,userPocket.fish)
		} else {
			val newFishList = userPocket.fish :+ pocketedCreature.fish.head
			Pocket(userPocket.bug, newFishList)
		}
	}

	def genericUpdateUser[A](username : String, key: String, value : A) : Unit = {
		val source = MongoSource(allUsers.find(classOf[User]))
			.map(_ => DocumentUpdate(filter = Filters.eq("username", username), update = Updates.set(key, value)))
		val taskFuture = source.runWith(MongoSink.updateOne(allUsers))
		taskFuture.onComplete{
			case Success(_) => log.info("UserOperations","genericUpdateUser", "Success", s"Updated $key")
			case Failure (ex) => log.warn("UserOperations","genericUpdateUser","Failure",s"Failed update $username: $ex")
		}
	}

	def updateOneUserTransaction(user : User) : User = {
		genericUpdateUser(user.username, "liveTurnips", user.liveTurnips)
		genericUpdateUser(user.username, "turnipTransactionHistory", user.turnipTransactionHistory)
		genericUpdateUser(user.username, "bells", user.bells)
		log.info("UserOperations","UpdateOneUserTransaction","Success",s"Updated ${user.username}'s bells and turnips")
		readOneUser(user.username).head
	}

	def updateTurnipTransactionStatsUponRetrieval(user: User): User = {
		genericUpdateUser(user.username, "liveTurnips", user.liveTurnips)
		genericUpdateUser(user.username, "turnipTransactionHistory", user.turnipTransactionHistory)
	    log.info("UserOperations","updateTurnipTransactionStatsUponRetrieval","Success",s"Updated ${user.username}'s turnips")
		readOneUser(user.username).head
	}

	def deleteOneForUser(username :String, creatureName : String, creatureBells: Int): Unit = {
		if (creatureBells > 0) {
			val userList: List[User] = readOneUser(username).toList
			val user: User = userList.head
			val source = Source(userList).map(_ => Filters.eq("username", username))
			val taskFuture = source.runWith(MongoSink.deleteOne(allUsers))
			taskFuture.onComplete {
				case Success(_) =>

					val	unSoughtBugs = user.pocket.bug.filter(creature => creature.name != creatureName)
					val	unSoughtFishes = user.pocket.fish.filter(creature => creature.name != creatureName)
					val	soughtBugs = user.pocket.bug.filter(creature => creature.name == creatureName)
					val	soughtFishes = user.pocket.fish.filter(creature => creature.name == creatureName)
					val soughtBugsOneRemoved = if (soughtBugs.contains(creatureName)) soughtBugs.takeRight(soughtBugs.length - 1 ) else List()
					val soughtFishesOneRemoved = if (soughtFishes.contains(creatureName)) soughtFishes.takeRight(soughtFishes.length - 1)  else List()
					val bugList = unSoughtBugs.appendedAll(soughtBugsOneRemoved)
					val fishList = unSoughtFishes.appendedAll(soughtFishesOneRemoved)

					val updatedPocket = Pocket(bugList, fishList)
					val updatedBells = user.bells + creatureBells
					val newUser = User(user.id, user.username, user.fishingPoleLvl, user.bugNetLvl, updatedBells, updatedPocket, user.liveTurnips, user.turnipTransactionHistory, user.avatar, user.encryptedPw, user.addedToChannel)
					createOneUser(newUser)
					log.info("UserOperations", "deleteOneForUser", "Success", s"Sold $creatureName for $creatureBells bells")
				case Failure(ex) =>
					log.warn("UserOperations", "deleteOneForUser", "Failure", s"Failed to delete one USER: $ex")
			}
		}else{
			log.warn("UserOperations", "deleteOneForUser", "Failure", s"Failed to delete one USER: Creature did not exist")
		}
	}

	def deleteAllCreatureForUser(username : String, species : String): Int = {
		val userList: List[User] = readOneUser(username).toList
		val user: User = userList.head
		val bugBells = Await.result(Source(user.pocket.bug).via(Flow[Bug].fold[Int](0)(_ + _.bells)).runWith(Sink.head), chill second)
		val fishBells = Await.result(Source(user.pocket.fish).via(Flow[Fish].fold[Int](0)(_ + _.bells)).runWith(Sink.head), chill second)

		if(species == BUG) {
			if (bugBells != 0) {
				val source = Source(userList).map(_ => Filters.eq("username", username))
				val taskFuture = source.runWith(MongoSink.deleteMany(allUsers))
				taskFuture.onComplete {
					case Success(_) =>
						val bug: List[Bug] = List()
						val updatedPocket = Pocket(bug, user.pocket.fish)
						val updatedBells = user.bells + bugBells
						val newUser = User(user.id, user.username, user.fishingPoleLvl, user.bugNetLvl, updatedBells, updatedPocket, user.liveTurnips, user.turnipTransactionHistory, user.avatar, user.encryptedPw, user.addedToChannel)
						log.info("UserOperations", "deleteAllCreatureForUser", "Success", s"Deleted $username's bugs")
						createOneUser(newUser)
					case Failure(ex) =>
						log.warn("UserOperations", "deleteAllCreatureForUser", "Failure", s"Failed to delete all bugs in $username's pocket:  $ex")
				}
			}
		}

		if(species == FISH){
			if (fishBells != 0) {
				val source = Source(userList).map(_ => Filters.eq("username", username))
				val taskFuture = source.runWith(MongoSink.deleteMany(allUsers))
				taskFuture.onComplete {
					case Success(_) =>
						val fish: List[Fish] = List()
						val updatedPocket = Pocket(user.pocket.bug, fish)
						val updatedBells = user.bells + fishBells
						val newUser = User(user.id, user.username, user.fishingPoleLvl, user.bugNetLvl, updatedBells, updatedPocket, user.liveTurnips, user.turnipTransactionHistory, user.avatar)
						log.info("UserOperations", "deleteAllCreatureForUser", "Success", s"Deleted $username's fishes")
						createOneUser(newUser)
					case Failure(ex) =>
						log.warn("UserOperations", "deleteAllCreatureForUser", "Failure", s"Failed to delete all fishes in $username's pocket:  $ex")
				}
			}
		}

		if(species == BUG) bugBells else fishBells
	}

	def deleteAllForUser(username : String): Int = {
		val userList: List[User] = readOneUser(username).toList
		val user: User = userList.head
		val bugBells = Await.result(Source(user.pocket.bug).via(Flow[Bug].fold[Int](0)(_ + _.bells)).runWith(Sink.head), chill second)
		val fishBells = Await.result(Source(user.pocket.fish).via(Flow[Fish].fold[Int](0)(_ + _.bells)).runWith(Sink.head), chill second)
		val creatureBells = bugBells + fishBells
		if (creatureBells != 0) {
			val source = Source(userList).map(_ => Filters.eq("username", username))
			val taskFuture = source.runWith(MongoSink.deleteMany(allUsers))
			taskFuture.onComplete {
				case Success(_) =>
					val bug : List[Bug] = List()
					val fish : List[Fish] = List()
					val updatedPocket = Pocket(bug, fish)
					val updatedBells = user.bells + creatureBells
					val newUser = User(user.id, user.username, user.fishingPoleLvl, user.bugNetLvl, updatedBells, updatedPocket, user.liveTurnips , user.turnipTransactionHistory, user.avatar)
					log.info("UserOperations", "deleteAllForUser", "Success", s"Deleted USER $username")
					createOneUser(newUser)
				case Failure(ex) =>
					log.warn("UserOperations", "deleteAllForUser", "Failure", s"Failed to delete all creature in $username's pocket:  $ex")
			}
		}else{
			log.warn("UserOperations", "deleteAllForUser", "Failure", s"Failed to delete creatures in $username's pocket : Nothing in pocket")

		}
		creatureBells
	}
}



