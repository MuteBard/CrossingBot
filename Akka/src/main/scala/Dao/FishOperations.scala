package Dao

import Data.FishData.Fishes
import Model.Fish_.Fish
import akka.stream.alpakka.mongodb.scaladsl.{MongoSink, MongoSource}
import akka.stream.scaladsl.{Sink, Source}
import org.bson.codecs.configuration.CodecRegistries.{fromProviders, fromRegistries}
import org.mongodb.scala.MongoClient.DEFAULT_CODEC_REGISTRY
import org.mongodb.scala.bson.codecs.Macros._

import scala.util.{Failure, Success}
import Logic.Main.system
import system.dispatcher

import scala.concurrent.duration._
import scala.concurrent.{Await, Future}

object FishOperations extends MongoDBOperations {
	val codecRegistry = fromRegistries(fromProviders(classOf[Fish]), DEFAULT_CODEC_REGISTRY)

	private val allFishes = db
		.getCollection("fish", classOf[Fish])
		.withCodecRegistry(codecRegistry)

	def BulkInsert(): Unit = {
		val source = Source(Fishes)
		val taskFuture = source.grouped(2).runWith(MongoSink.insertMany[Fish](allFishes))
		taskFuture.onComplete{
			case Success(_) => println(s"Successfully created all ${Fishes.length} fishes")
			case Failure (ex) => println(s"Failed bulk insert: $ex")
		}
	}

	def retrieveAll: List[Fish] = {
		val source = MongoSource(allFishes.find(classOf[Fish]))
		val fishSeqFuture = source.runWith(Sink.seq)
		val fishSeq : Seq[Fish] = Await.result(fishSeqFuture, 1 seconds)
		fishSeq.toList
	}
}