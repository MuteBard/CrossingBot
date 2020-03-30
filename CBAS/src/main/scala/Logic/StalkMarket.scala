package Logic

import Actors.MarketActor._
import Logic.Main._
import system.dispatcher
import scala.concurrent.duration._

object StalkMarket {

	object populateDay{
		marketActor ! Start_Todays_Market
	}

	object beginTimers {
		val checkForHourChange = system.scheduler.scheduleWithFixedDelay(Duration.Zero, 1 minute, marketActor, Create_New_Movement_Record )
		val checkForDayChange = system.scheduler.scheduleWithFixedDelay(Duration.Zero, 10 days, marketActor, Delete_Earliest_Movement_Records )

	}
//
//	def endTimers {
//		import beginTimers._
//		checkForBlockChange.cancel()
//		checkForHourChange.cancel()
//		checkForDayChange.cancel()
//	}

}
