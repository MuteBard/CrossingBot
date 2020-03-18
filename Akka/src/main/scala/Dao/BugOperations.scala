package Dao

import Data.BugData.Bugs
import Model.Bug_.Bug
import akka.Done
import akka.stream.alpakka.mongodb.scaladsl.MongoSink
import akka.stream.scaladsl.Source
import org.bson.codecs.configuration.CodecRegistries.{fromProviders, fromRegistries}
import org.mongodb.scala.MongoClient.DEFAULT_CODEC_REGISTRY
import org.mongodb.scala.bson.codecs.Macros._

import scala.concurrent.Future
import scala.util.{Failure, Success}
import Logic.Main.system
import system.dispatcher

object BugOperations extends MongoDBOperations{
	val codecRegistry = fromRegistries(fromProviders(classOf[Bug]), DEFAULT_CODEC_REGISTRY)

	private val allBugs = db
		.getCollection("bug", classOf[Bug])
		.withCodecRegistry(codecRegistry)

	def BulkInsert{
		val source = Source(Bugs)
		val operation: Future[Done] = source.grouped(2).runWith(MongoSink.insertMany[Bug](allBugs))
		operation.onComplete{
			case Success(_) => println(s"Successfully Bulk inserted all ${Bugs.length} bugs")
			case Failure (ex) => println(s"Failed bulk insert: $ex")
		}
	}
}
