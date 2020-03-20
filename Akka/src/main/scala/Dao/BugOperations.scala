package Dao

import Data.BugData.Bugs
import Model.Bug_.Bug
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

object BugOperations extends MongoDBOperations{
	val codecRegistry = fromRegistries(fromProviders(classOf[Bug]), DEFAULT_CODEC_REGISTRY)

	private val allBugs = db
		.getCollection("bug", classOf[Bug])
		.withCodecRegistry(codecRegistry)

	def createAll(): Unit = {
		val source = Source(Bugs)
		val taskFuture = source.grouped(2).runWith(MongoSink.insertMany(allBugs))
		taskFuture.onComplete{
			case Success(_) => println(s"Successfully created ${Bugs.length} bugs")
			case Failure (ex) => println(s"Failed create: $ex")
		}
	}

	def readAll(): List[Bug] = {
		val source = MongoSource(allBugs.find(classOf[Bug]))
		val bugSeqFuture = source.runWith(Sink.seq)
		val bugSeq : Seq[Bug] = Await.result(bugSeqFuture, 1 seconds)
		bugSeq.toList
	}

	def readById(query : String) : List[Bug] = {
		val source = MongoSource(allBugs.find(classOf[Bug])).filter(bugs => bugs.bugId == query)
		val bugSeqFuture = source.runWith(Sink.seq)
		val bugSeq : Seq[Bug] = Await.result(bugSeqFuture, 1 seconds)
		bugSeq.toList
	}

	def readByRarity(query : Int) : List[Bug] = {
		val source = MongoSource(allBugs.find(classOf[Bug])).filter(bugs => bugs.rarity == query)
		val bugSeqFuture = source.runWith(Sink.seq)
		val bugSeq : Seq[Bug] = Await.result(bugSeqFuture, 1 seconds)
		List(Random.shuffle(bugSeq.toList).head)
	}

	//want to check if the contents of availability if they intersect with query, only those that have all of query's months with pass
	def readByMonth(query : List[String]) : List[Bug] = {
		val source = MongoSource(allBugs.find(classOf[Bug])).filter(bugs => bugs.availability.intersect(query) == query)
		val bugSeqFuture = source.runWith(Sink.seq)
		val bugSeq : Seq[Bug] = Await.result(bugSeqFuture, 1 seconds)
		bugSeq.toList
	}

	def readByRarityAndMonth(queryInt : Int, queryList : List[String]) : List[Bug] = {
		val source = MongoSource(allBugs.find(classOf[Bug])).filter(bugs => (bugs.rarity == queryInt) && bugs.availability.intersect(queryList) == queryList)
		val bugSeqFuture = source.runWith(Sink.seq)
		val bugSeq : Seq[Bug] = Await.result(bugSeqFuture, 1 seconds)
		List(Random.shuffle(bugSeq.toList).head)
	}

}