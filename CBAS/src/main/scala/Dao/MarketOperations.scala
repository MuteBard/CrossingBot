package Dao

import Data.Market.MarketQuarterBlock.QuarterBlock
import Data.Market.MarketHourBlock.HourBlock
import Helper.Auxiliary.log
import Model.Major.MovementRecord_.MovementRecord
import akka.stream.alpakka.mongodb.scaladsl.{MongoSink, MongoSource}
import akka.stream.scaladsl.{Sink, Source}
import org.bson.codecs.configuration.CodecRegistries.{fromProviders, fromRegistries}
import org.mongodb.scala.MongoClient.DEFAULT_CODEC_REGISTRY
import org.mongodb.scala.bson.codecs.Macros._
import App.Main.system
import akka.stream.alpakka.mongodb.DocumentUpdate
import org.mongodb.scala.model.{Filters, Updates}
import system.dispatcher

import scala.concurrent.Await
import scala.concurrent.duration._
import scala.util.{Failure, Success}


object  MarketOperations extends MongoDBOperations {
	val codecRegistryStalks = fromRegistries(fromProviders(classOf[MovementRecord],classOf[HourBlock], classOf[QuarterBlock]), DEFAULT_CODEC_REGISTRY)

	private val allMR = db
		.getCollection("MovementRecord", classOf[MovementRecord])
		.withCodecRegistry(codecRegistryStalks)

	def createMovementRecord(mr : MovementRecord): Unit = {
		val mrList : List[MovementRecord] = List(mr)
		val source = Source(mrList)
		val taskFuture = source.runWith(MongoSink.insertOne[MovementRecord](allMR))
		taskFuture.onComplete{
			case Success(_) => log.info("MarketOperations","createMovementRecord","Success",s"Created 1 MovementRecord")
			case Failure (ex) => log.warn("MarketOperations","createMovementRecord","Failure",s"Failed create 1 MovementRecord: $ex")
		}
	}

	def updateMovementRecordField[A](mr : MovementRecord, key :String, value : A) : Unit = {
		val source = MongoSource(allMR.find(classOf[MovementRecord]))
    		.map(_ => DocumentUpdate(filter = Filters.eq("_id", mr._id), update = Updates.set(key, value)))
		val taskFuture = source.runWith(MongoSink.updateOne(allMR))
		taskFuture.onComplete{
			case Success(_) =>
				log.info("MarketOperations","updateMovementRecord","Success",s"Updated MovementRecord ${mr._id}'s $key")
			case Failure (ex) =>
				log.warn("MarketOperations","updateMovementRecord","Failure",s"Failed to update MovementRecord ${mr._id}'s $key: $ex")
		}
	}

	def massUpdateMovementRecord(mr : MovementRecord) : Unit = {
		updateMovementRecordField(mr, "hourBlockId", mr.hourBlockId)
		updateMovementRecordField(mr, "quarterBlockId", mr.quarterBlockId)
		updateMovementRecordField(mr, "todayHigh", mr.todayHigh)
		updateMovementRecordField(mr, "todayLow", mr.todayLow)
		updateMovementRecordField(mr, "hourBlockName", mr.hourBlockName)
		updateMovementRecordField(mr, "latestHourBlock", mr.latestHourBlock)
		updateMovementRecordField(mr, "latestQuarterBlock", mr.latestQuarterBlock)
		updateMovementRecordField(mr, "quarterBlockHistory", mr.quarterBlockHistory)
		updateMovementRecordField(mr, "latestTurnipPrice", mr.latestTurnipPrice)
		updateMovementRecordField(mr, "turnipPriceHistory", mr.turnipPriceHistory)
	}

	def readEarliestMovementRecord(): MovementRecord = readMovementRecord().head

	def readLatestMovementRecord(): MovementRecord = readMovementRecord().reverse.head

	def readMovementRecord(): Seq[MovementRecord] = {
		val source = MongoSource(allMR.find(classOf[MovementRecord]))
		val daySeqFuture = source.runWith(Sink.seq)
		val daySeq : Seq[MovementRecord] = Await.result(daySeqFuture, 1 seconds)
		if(daySeq.length == 0){
			List(MovementRecord())
		}else{
			daySeq
		}
	}

	def readMovementRecordListByMonth(month :  Int): List[MovementRecord] = {
		val source = MongoSource(allMR.find(classOf[MovementRecord])).filter(mr => mr.month == month)
		val daySeqFuture = source.runWith(Sink.seq)
		val daySeq : Seq[MovementRecord] = Await.result(daySeqFuture, 1 seconds)
		daySeq.toList
	}

	def deleteOldestMovementRecords(month : Int) :  Unit = {
		val mrList  = readMovementRecord().toList
		val source = Source(mrList).map(_ => Filters.eq("month", month))
		val taskFuture = source.runWith(MongoSink.deleteMany(allMR))
		taskFuture.onComplete{
			case Success(_) => {
				val deletedMR = mrList.length - readMovementRecord().length
				log.info("MarketOperations","deleteOldestMovementRecords","Success",s" Deleted $deletedMR MovementRecord(s)")
			}
			case Failure (ex) => log.warn("MarketOperations","deleteOldestMovementRecords","Failure",s"Failed to delete MovementRecord(s): $ex")
		}
	}
}
