package Dao
import Helper.Auxiliary.log
import Model.Major.Fish_.Fish
import akka.stream.alpakka.mongodb.scaladsl.{MongoSink, MongoSource}
import akka.stream.scaladsl.{Sink, Source}
import org.bson.codecs.configuration.CodecRegistries.{fromProviders, fromRegistries}
import org.mongodb.scala.MongoClient.DEFAULT_CODEC_REGISTRY
import org.mongodb.scala.bson.codecs.Macros._

import scala.util.{Failure, Success}
import Logic.Main.system
import Model.Major.Bug_.Bug
import Model.Major.User_.User
import Model.Major.Pocket_.Pocket
import akka.stream.alpakka.mongodb.DocumentUpdate
import org.mongodb.scala.model.{Filters, Updates}
import system.dispatcher

import scala.concurrent.duration._
import scala.concurrent.Await

object UserOperations extends MongoDBOperations {
	val codecRegistryUser = fromRegistries(fromProviders(classOf[User],classOf[Pocket], classOf[Bug], classOf[Fish]), DEFAULT_CODEC_REGISTRY)
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

	def readOneUser(username : String): Seq[User] = {
		val source = MongoSource(allUsers.find(classOf[User])).filter(users => users.username == username)
		val userSeqFuture = source.runWith(Sink.seq)
		val userSeq : Seq[User] = Await.result(userSeqFuture, 1 seconds)
		userSeq
	}

	def updateUser(data : User) : Unit = {

		val pocketKey = getPocketKey(data)

		val source = MongoSource(allUsers.find(classOf[User]))
			.map(user => {
				val updatedPocket = if (pocketKey == "bug") newPocket("bug", user.pocket, data.pocket) else newPocket("fish", user.pocket, data.pocket)

				DocumentUpdate(filter = Filters.eq("username", data.username), update = Updates.set("pocket", updatedPocket))
			})
		val taskFuture = source.runWith(MongoSink.updateOne(allUsers))

		taskFuture.onComplete{
			case Success(_) =>
				if(readOneUser(data.username).nonEmpty)
					log.info("UserOperations","updateUser","True Success",s"Updated ${data.username}'s pocket successfully")
				else {
					log.warn("UserOperations","updateUser","Partial Failure",s"Failed to properly update, user ${data.username}'s does not exist. Creating new user")
				}
			case Failure (ex) =>
				log.warn("UserOperations","updateUser","Failure",s"Failed update: $ex")
		}
	}

	def newPocket(creature : String, databasePocket: Pocket , queryPocket: Pocket): Pocket = {
		if(creature == "bug"){
			val newBugList = databasePocket.bug :+ queryPocket.bug.head
			Pocket(newBugList,databasePocket.fish)
		} else {
			val newFishList = databasePocket.fish :+ queryPocket.fish.head
			Pocket(databasePocket.bug, newFishList)
		}
	}

	def getPocketKey(data: User): String = {
		if (data.pocket.bug.nonEmpty) {
			"bug"
		} else {
			"fish"
		}
	}
}
