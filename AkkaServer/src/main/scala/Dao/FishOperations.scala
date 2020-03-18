package Dao

import Data.FishData.Fishes
import Model.Fish_.Fish
import akka.Done
import akka.stream.alpakka.mongodb.scaladsl.{MongoSink, MongoSource}
import akka.stream.scaladsl.{Sink, Source}
import org.bson.codecs.configuration.CodecRegistries.{fromProviders, fromRegistries}
import org.mongodb.scala.MongoClient.DEFAULT_CODEC_REGISTRY
import org.mongodb.scala.bson.codecs.Macros._

import scala.concurrent.Future
import scala.util.{Failure, Success}
import Logic.Main.system
import system.dispatcher

object FishOperations extends MongoDBOperations {
	val codecRegistry = fromRegistries(fromProviders(classOf[Fish]), DEFAULT_CODEC_REGISTRY)

	private val allFishes = db
		.getCollection("fish", classOf[Fish])
		.withCodecRegistry(codecRegistry)

	def BulkInsert{
		val source = Source(Fishes)
		val operation: Future[Done] = source.grouped(2).runWith(MongoSink.insertMany[Fish](allFishes))
		operation.onComplete{
			case Success(_) => println(s"Successfully Bulk inserted all ${Fishes.length} fishes")
			case Failure (ex) => println(s"Failed bulk insert: $ex")
		}
	}

	def retrieveAll {
		val source = MongoSource(allFishes.find(classOf[Fish]))
		val result = source.runWith(Sink.seq)
		result.onComplete {
			case Success(_) => println(s"Successfully retrieved bugs")
			case Failure(ex) => println(s"Failed bulk insert: $ex")
		}
	}
}
