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
	var turnipPrice = 10000
	var isTodayMarketNotUpdated = true
	val isDayNotInitialized : Boolean = currentHourBlockId == -1 && currentQuarterBlockId == -1
	val isNewDay :  Boolean  = currentHourBlockId == 0 && currentQuarterBlockId == 0

	override def receive: Receive = {
		//AUTOMATED
		case Start_Todays_Market =>
			log.info(s"[Start_Todays_Market] Generating all block patterns for the day")
			todayMarket = Day().generate()
			isTodayMarketNotUpdated = false
			self ! Create_New_Movement_Record

		//AUTOMATED
		case Create_New_Movement_Record  =>
			val dt = Calendar.getInstance()
			val newHourBlockId = dt.get(Calendar.HOUR)
			val newQuarterBlockId = dt.get(Calendar.MINUTE) / 15
			log.info(s"[Create_New_Movement_Record] Checking for difference in block ids")
			if(currentQuarterBlockId != newQuarterBlockId) {
				if(isDayNotInitialized){
					log.info(s"[Start_Todays_Market] Initialize Stalk Market")
					self ! Start_Todays_Market
				}
				if(isNewDay && isTodayMarketNotUpdated){
					log.info(s"[Create_New_Movement_Record] A new day has been detected")
					self ! Start_Todays_Market
				}else{
					log.info(s"[Create_New_Movement_Record] Change in block ids found")
					val _id = dateId()
					val high = todayMarket.getMax2DBy(newHourBlockId, newQuarterBlockId)
					val low = todayMarket.getMin2DBy(newHourBlockId, newQuarterBlockId)
					val patternHour = todayMarket.getHourBlock(newHourBlockId)
					val patternHourHistory = todayMarket.getHourBlockHistory(newHourBlockId)
					val patternBlock = todayMarket.getQuarterBlock(newHourBlockId, newQuarterBlockId)
					val patternBlockHistory = todayMarket.getQuarterBlockHistory(newHourBlockId, newQuarterBlockId)
					val month = month()
					val day = day()
					turnipPrice = turnipPrice + todayMarket.getQuarterBlock(newHourBlockId, newQuarterBlockId).change

					val mr = MovementRecord(_id, newHourBlockId, newQuarterBlockId, high, low, patternHour, patternHourHistory, patternBlock, patternBlockHistory, month, day, turnipPrice)
					log.info(s"[Create_New_Movement_Record] Creating new Movement Record")
					if(isNewDay){
						MarketOperations.createMovementRecord(mr)
					}else{
						MarketOperations.updateMovementRecord(mr)
					}

				}

				currentHourBlockId = newHourBlockId
				currentQuarterBlockId = newQuarterBlockId
				isTodayMarketNotUpdated = true
			}
		//AUTOMATED
		case Delete_Earliest_Movement_Records  =>
			log.info(s"[Delete_Earliest_Movement_Records] Getting earliest Movement Record")
			val dt = Calendar.getInstance()
			val currentMonth  = dt.get(Calendar.MONTH)+1
			val oldMonth = MarketOperations.readEarliestMovementRecord().date.month
			if (currentMonth - oldMonth > 2){
				log.info(s"[Delete_Earliest_Movement_Records] Deleting old Movement Records")
				MarketOperations.deleteOldestMovementRecords(oldMonth)
			}

		case Read_Latest_Movement_Record_Day =>
			log.info(s"[Read_Latest_Movement_Record] Getting latest Movement Record")
			sender() ! MarketOperations.readLatestMovementRecord()

		case RequestTurnipPrice =>
			log.info(s"[RequestTurnipPrice] Getting turnip price")
			sender() ! MarketOperations.readLatestMovementRecord().turnipPrice

		case Read_Selected_Movement_Records_Month =>
			val dt = Calendar.getInstance()
			val currentMonth  = dt.get(Calendar.MONTH)+1
			log.info(s"[Read_Current_Months_Movement_Records] Getting all movement records")
			sender() ! MarketOperations.readMovementRecordListByMonth(currentMonth)
	}
}
