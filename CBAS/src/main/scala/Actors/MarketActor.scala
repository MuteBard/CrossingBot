package Actors

import java.util.Calendar

import Helper.Auxiliary._
import Dao.MarketOperations
import Data.Market.MarketDay.Day
import Model.Major.MovementRecord_.MovementRecord
import akka.actor.{Actor, ActorLogging}

object MarketActor {

	case object Read_Selected_Movement_Records_Month
	case object RequestTurnipPrice
	case object Delete_Earliest_Movement_Records
	case object Read_Latest_Movement_Record_Day
	case object Create_New_Movement_Record
	case object Start_Todays_Market
}

class MarketActor extends Actor with ActorLogging {
	import Actors.MarketActor._

	var todayMarket = Day()
	var currentHourBlockId: Int = -1
	var currentQuarterBlockId: Int = -1

	override def receive: Receive = {
		//AUTOMATED
		case Start_Todays_Market =>
			log.info(s"[Start_Todays_Market] Generating all block patterns for the day")
			todayMarket = Day().generate()
			log.info(s"[Start_Todays_Market] Today's Market: $todayMarket")
			self ! Create_New_Movement_Record

		//AUTOMATED
		case Create_New_Movement_Record  =>
			val dt = Calendar.getInstance()
			val newHourBlockId = dt.get(Calendar.HOUR)
			val newQuarterBlockId = dt.get(Calendar.MINUTE) / 15
			val prevMR = MarketOperations.readLatestMovementRecord()
//			log.info(s"[Create_New_Movement_Record] Checking for difference in block ids")
			if(currentQuarterBlockId != newQuarterBlockId || prevMR._id == "") {
				if(currentHourBlockId == -1 && currentQuarterBlockId == -1){
					log.info(s"[Start_Todays_Market] Initializing Stalk Market")
					self ! Start_Todays_Market
				}
				else if(currentHourBlockId == 0 && currentQuarterBlockId == 0){
					log.info(s"[Create_New_Movement_Record] A new day has been detected")
					self ! Start_Todays_Market
				}else{
					log.info(s"[Create_New_Movement_Record] Change in block ids found")

					val newTurnipPrice = prevMR.latestTurnipPrice + todayMarket.getQuarterBlock(newHourBlockId, newQuarterBlockId).change
					val _id = dateId()
					val high = Math.max(newTurnipPrice, prevMR.latestTurnipPrice)
					val low = Math.min(newTurnipPrice, prevMR.latestTurnipPrice)
					val latestHourBlock = todayMarket.getHourBlock(newHourBlockId)
					val latestHourBlockName = todayMarket.getHourBlock(newHourBlockId).name
					val latestQuarterBlock = todayMarket.getQuarterBlock(newHourBlockId, newQuarterBlockId)
					val quarterBlockHistory = todayMarket.getQuarterBlockHistory(newHourBlockId, newQuarterBlockId)
					val turnipPriceHistory =  newTurnipPrice +: prevMR.turnipPriceHistory
					val monthForMR = month()
					val dayForMR  = day()


					val mr = MovementRecord(_id,newHourBlockId,newQuarterBlockId,high,low,latestHourBlockName,latestHourBlock,
						latestQuarterBlock,quarterBlockHistory,newTurnipPrice,turnipPriceHistory,monthForMR,dayForMR
					)


					if(currentHourBlockId == 0 && currentQuarterBlockId == 0  || prevMR._id == ""){
						log.info(s"[Create_New_Movement_Record] Creating new Movement Record")
						MarketOperations.createMovementRecord(mr)
					}else{
						log.info(s"[Create_New_Movement_Record] Updating Movement Record")
						MarketOperations.massUpdateMovementRecord(mr)
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

		case RequestTurnipPrice =>
			log.info(s"[RequestTurnipPrice] Getting turnip price")
			sender() ! MarketOperations.readLatestMovementRecord().latestTurnipPrice

		case Read_Selected_Movement_Records_Month =>
			val dt = Calendar.getInstance()
			val currentMonth  = dt.get(Calendar.MONTH)+1
			log.info(s"[Read_Current_Months_Movement_Records] Getting all movement records")
			sender() ! MarketOperations.readMovementRecordListByMonth(currentMonth)
	}
}
