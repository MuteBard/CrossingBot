package Actors

import java.util.Calendar

import Helper.Auxiliary._
import Dao.MarketOperations
import Data.Market.MarketDay.Day
import Model.Major.MovementRecord_.MovementRecord
import akka.actor.{Actor, ActorLogging}

object MarketActor {

	case object Read_Selected_Movement_Records_Month
	case object Request_Turnip_Price
	case object Delete_Earliest_Movement_Records
	case object Read_Latest_Movement_Record_Day
	case object Create_New_Movement_Record
	case object Start_Todays_Market
}

class MarketActor extends Actor with ActorLogging {
	import Actors.MarketActor._

	var todayMarket = Day()
	var dateMarketCreated = ""
	var currentHourBlockId: Int = -1
	var currentQuarterBlockId: Int = -1

	override def receive: Receive = {
		//AUTOMATED
		case Start_Todays_Market =>
			log.info(s"[Start_Todays_Market] Generating all block patterns for the day")
			todayMarket = Day().generate()
			dateMarketCreated = todayDateId()
			log.info(s"[Start_Todays_Market] Today's Market: $todayMarket")
			self ! Create_New_Movement_Record

		//AUTOMATED
		case Create_New_Movement_Record  =>
			val dt = Calendar.getInstance()
			val newHourBlockId = dt.get(Calendar.HOUR_OF_DAY)
			val newQuarterBlockId = dt.get(Calendar.MINUTE) / 15
//			log.info(s"[Create_New_Movement_Record] Checking for difference in block ids")
			val suspectMR = MarketOperations.readLatestMovementRecord()
			val mr = if(suspectMR._id != date()) MovementRecord(
				_id = suspectMR._id,
				latestTurnipPrice = suspectMR.latestTurnipPrice,
				todayHigh = suspectMR.latestTurnipPrice,
				todayLow = suspectMR.latestTurnipPrice,
				turnipPriceHistory = List(suspectMR.turnipPriceHistory.head)
			) else suspectMR

			if(currentQuarterBlockId != newQuarterBlockId) {

				if(dateMarketCreated != todayDateId()){
					log.info(s"[Create_New_Movement_Record] A new day has been detected")
					self ! Start_Todays_Market
				}else{
					log.info(s"[Create_New_Movement_Record] Change in block ids found")

					val newTurnipPrice = mr.latestTurnipPrice + todayMarket.getQuarterBlock(newHourBlockId, newQuarterBlockId).change
					val _id = todayDateId()
					val high = Math.max(newTurnipPrice, mr.todayHigh)
					val low = Math.min(newTurnipPrice, mr.todayLow)
					val latestHourBlock = todayMarket.getHourBlock(newHourBlockId)
					val latestHourBlockName = todayMarket.getHourBlock(newHourBlockId).name
					val latestQuarterBlock = todayMarket.getQuarterBlock(newHourBlockId, newQuarterBlockId)
					val quarterBlockHistory = todayMarket.getQuarterBlockHistory(newHourBlockId, newQuarterBlockId)
					val turnipPriceHistory =  newTurnipPrice +: mr.turnipPriceHistory
					val monthForMR = month()
					val dayForMR  = day()

					val newMr = MovementRecord(_id,newHourBlockId,newQuarterBlockId,high,low,latestHourBlockName,latestHourBlock,
						latestQuarterBlock,quarterBlockHistory,newTurnipPrice,turnipPriceHistory,monthForMR,dayForMR
					)

					if(mr._id != newMr._id ){
						log.info(s"[Create_New_Movement_Record] Creating new Movement Record")
						MarketOperations.createMovementRecord(newMr)
					}else{
						log.info(s"[Create_New_Movement_Record] Updating Movement Record")
						MarketOperations.massUpdateMovementRecord(newMr)
					}
				}

				currentHourBlockId = newHourBlockId
				currentQuarterBlockId = newQuarterBlockId
			}
		//AUTOMATED
		case Delete_Earliest_Movement_Records  =>
			log.info(s"[Delete_Earliest_Movement_Records] Getting earliest Movement Record")
			val dt = Calendar.getInstance()
			val currentMonth  = dt.get(Calendar.MONTH)+1
			val oldMonth = MarketOperations.readEarliestMovementRecord().month
			if (currentMonth - oldMonth > 2){
				log.info(s"[Delete_Earliest_Movement_Records] Deleting old Movement Records")
				MarketOperations.deleteOldestMovementRecords(oldMonth)
			}

		case Read_Latest_Movement_Record_Day =>
			log.info(s"[Read_Latest_Movement_Record] Getting latest Movement Record")
			sender() ! MarketOperations.readLatestMovementRecord()

		case Request_Turnip_Price =>
			log.info(s"[Request_Turnip_Price] Getting turnip price")
			sender() ! MarketOperations.readLatestMovementRecord().latestTurnipPrice

		case Read_Selected_Movement_Records_Month =>
			val dt = Calendar.getInstance()
			val currentMonth  = dt.get(Calendar.MONTH)+1
			log.info(s"[Read_Current_Months_Movement_Records] Getting all movement records")
			sender() ! MarketOperations.readMovementRecordListByMonth(currentMonth)
	}
}
