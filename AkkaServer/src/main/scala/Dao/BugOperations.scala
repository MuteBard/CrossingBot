package Dao

import Data.BugData.Bugs
import Model.Bug_.Bug
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

object BugOperations extends MongoDBOperations{
	val codecRegistry = fromRegistries(fromProviders(classOf[Bug]), DEFAULT_CODEC_REGISTRY)

	private val allBugs = db
		.getCollection("bug", classOf[Bug])
		.withCodecRegistry(codecRegistry)

	def BulkInsert(): Unit = {
		val source = Source(Bugs)
		val taskFuture = source.grouped(2).runWith(MongoSink.insertMany[Bug](allBugs))
		taskFuture.onComplete{
			case Success(_) => println(s"Successfully created all ${Bugs.length} bugs")
			case Failure (ex) => println(s"Failed bulk insert: $ex")
		}
	}

	def retrieveAll: List[Bug] = {
		val source = MongoSource(allBugs.find(classOf[Bug]))
		val bugSeqFuture = source.runWith(Sink.seq)
		val bugSeq : Seq[Bug] = Await.result(bugSeqFuture, 1 seconds)
		bugSeq.toList
	}

//	def getOne(id : String){
//
//	}
//
//	def getMany(): Unit ={
//
//	}
}
