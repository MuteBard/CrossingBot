package Dao
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


	private val allUsers = db
		.getCollection("user", classOf[User])
		.withCodecRegistry(codecRegistryUser)

	def createOneUser(user : User): Unit = {
		val source = Source(List(user))
		val taskFuture = source.runWith(MongoSink.insertOne(allUsers))
		taskFuture.onComplete{
			case Success(_) => println(s"Added a user with no errors")
			case Failure (ex) => println(s"Failed create: $ex")
		}
	}

	def readOneUser(username : String): Seq[User] = {
		val source = MongoSource(allUsers.find(classOf[User])).filter(users => users.username == username)
		val userSeqFuture = source.runWith(Sink.seq)
		val userSeq : Seq[User] = Await.result(userSeqFuture, 1 seconds)
		userSeq
	}

	def updateUser(data : User) : Unit = {
		val creatureIdOption = Option(data.pocket.bug.head.getId).orElse(Option(data.pocket.fish.head.getId))
		val pocketKey = creatureIdOption match {
			case Some(id) => if(id.contains("B")) "bug" else "fish"
			case None => throw new Exception
		}
		val source = MongoSource(allUsers.find(classOf[User]))
			.map(user => {
				val updatedPocketData = if (pocketKey == "bug") user.pocket.bug :+ data.pocket.bug else user.pocket.fish :+ data.pocket.fish
				DocumentUpdate(filter = Filters.eq("username", data.username), update = Updates.set(pocketKey, updatedPocketData))
			})
		val taskFuture = source.runWith(MongoSink.updateOne(allUsers))

		taskFuture.onComplete{
			case Success(_) => print("IDK")
				if(readOneUser(data.username).nonEmpty)
					println(s"Updated ${data.username}'s successfully")
				else {
					println(s"Failed to properly update, user ${data.username}'s does not exist. Creating new user")

//					val pocket = List(data)
//					val newSource = Source(pocket)
//
//					val taskFuture = newSource.runWith(MongoSink.insertOne(allUsers))
//					taskFuture.onComplete {
//						case Success(_) => println(s"Successfully created 1 user")
//						case Failure(ex) => println(s"[UserOperations] [updateUser] : Failed create user: $ex")
//					}
				}
			case Failure (ex) =>
				println(s"Failed update: $ex")
		}
	}

//	def updatePocket(data : Pocket): Unit = {
//		val creatureIdOption = Option(data.bug.head.getId).orElse(Option(data.fish.head.getId))
//		val pocketKey = creatureIdOption match {
//			case Some(id) => if(id.contains("B")) "bug" else "fish"
//			case None => throw new Exception
//		}
//		val source = MongoSource(allPockets.find(classOf[Pocket]))
//			.map(pocket => {
//				val updatedPocketData = if (pocketKey == "bug") pocket.bug :+ data.bug else pocket.fish :+ data.fish
//				DocumentUpdate(filter = Filters.eq("username", data.username), update = Updates.set(pocketKey, updatedPocketData))
//			})
//
//		val taskFuture = source.runWith(MongoSink.updateOne(allPockets)) //REPLACE
//		taskFuture.onComplete{
//			case Success(_) =>
//				if(readOnePocket(data.username).nonEmpty)
//					println(s"Updated ${data.username}'s successfully")
//				else {
//					println(s"Failed to properly update, ${data.username}'s pocket does not exist. Creating new pocket")
//
//					val pocket = List(data)
//					val newSource = Source(pocket)
//
//					val taskFuture = newSource.runWith(MongoSink.insertOne(allPockets))
//					taskFuture.onComplete {
//						case Success(_) => println(s"Successfully created 1 pocket")
//						case Failure(ex) => println(s"[PocketOperations] [updatePocket] : Failed create: $ex")
//					}
//				}
//			case Failure (ex) =>
//				println(s"Failed update: $ex")
//		}
//	}
}
