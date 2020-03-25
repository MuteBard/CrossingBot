package Dao

import Data.FishData.Fishes
import Model.Major.Fish_.Fish
import akka.stream.alpakka.mongodb.scaladsl.{MongoSink, MongoSource}
import akka.stream.scaladsl.{Sink, Source}
import org.bson.codecs.configuration.CodecRegistries.{fromProviders, fromRegistries}
import org.mongodb.scala.MongoClient.DEFAULT_CODEC_REGISTRY
import org.mongodb.scala.bson.codecs.Macros._

import scala.util.{Failure, Random, Success}
import Logic.Main.system
import system.dispatcher

import scala.concurrent.duration._
import scala.concurrent.Await

object FishOperations extends MongoDBOperations {
	val codecRegistry = fromRegistries(fromProviders(classOf[Fish]), DEFAULT_CODEC_REGISTRY)

	private val allFishes = db
		.getCollection("fish", classOf[Fish])
		.withCodecRegistry(codecRegistry)

	def createAll(): Unit = {
		val source = Source(Fishes)
		val taskFuture = source.grouped(2).runWith(MongoSink.insertMany[Fish](allFishes))
		taskFuture.onComplete{
			case Success(_) => println(s"Successfully created ${Fishes.length} fishes")
			case Failure (ex) => println(s"Failed create: $ex")
		}
	}

	def readAll(): List[Fish] = {
		val source = MongoSource(allFishes.find(classOf[Fish]))
		val fishSeqFuture = source.runWith(Sink.seq)
		val fishSeq : Seq[Fish] = Await.result(fishSeqFuture, 1 seconds)
		fishSeq.toList
	}

	def readOneById(query : String) : Fish = {
		val source = MongoSource(allFishes.find(classOf[Fish])).filter(fishes => fishes.fishId == query)
		val fishSeqFuture = source.runWith(Sink.seq)
		val fishSeq : Seq[Fish] = Await.result(fishSeqFuture, 1 seconds)
		fishSeq.head
	}
//	def readOneByRarity(query : Int) : Fish = {
//		val source = MongoSource(allFishes.find(classOf[Fish])).filter(fishes => fishes.rarity == query)
//		val fishSeqFuture = source.runWith(Sink.seq)
//		val fishSeq : Seq[Fish] = Await.result(fishSeqFuture, 1 seconds)
//		Random.shuffle(fishSeq.toList).head
//	}
	//want to check if the contents of availability if they intersect with query, only those that have all of query's months with pass
	def readAllByMonth(query : List[String]) : List[Fish] = {
		val source = MongoSource(allFishes.find(classOf[Fish])).filter(fishes => fishes.availability.intersect(query) == query)
		val fishSeqFuture = source.runWith(Sink.seq)
		val fishSeq : Seq[Fish] = Await.result(fishSeqFuture, 1 seconds)
		fishSeq.toList
	}

	def readOneByRarityAndMonth(queryInt : Int, queryList : List[String]) : Fish = {
		val source = MongoSource(allFishes.find(classOf[Fish])).filter(fishes => (fishes.rarity == queryInt) && fishes.availability.intersect(queryList) == queryList)
		val fishSeqFuture = source.runWith(Sink.seq)
		val fishSeq : Seq[Fish] = Await.result(fishSeqFuture, 1 seconds)
		Random.shuffle(fishSeq.toList).head
	}

	def readAllRarestByMonth(queryList : List[String]) : List[Fish] = {
		val source = MongoSource(allFishes.find(classOf[Fish])).filter(fishes => (fishes.rarity == 5 || fishes.rarity == 4) && fishes.availability.intersect(queryList) == queryList)
		val bugSeqFuture = source.runWith(Sink.seq)
		val bugSeq : Seq[Fish] = Await.result(bugSeqFuture, 1 seconds)
		bugSeq.toList
	}
}