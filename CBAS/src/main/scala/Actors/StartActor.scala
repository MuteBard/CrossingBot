package Actors

import Logic.Main._
import Actors.MarketActor._
import Dao.{BugOperations, FishOperations}
import system.dispatcher

import scala.concurrent.duration._
import Logic.StalkMarket
import akka.actor.{Actor, ActorLogging, Cancellable}

object StartActor {
	case object Create_Creatures_All
	case object StartMarketTimers
	case object StopMarketTimers
}

class StartActor extends Actor with ActorLogging{
	import StartActor._

	var createMovementRecords : Cancellable = _
	var deleteOldMovementRecords : Cancellable = _

	override def receive: Receive = {
		case Create_Creatures_All =>
			log.info("[Create_Creatures_All] Inserting all BUG and FISH in Database")
			BugOperations.createAll()
			FishOperations.createAll()
			sender() ! "Completed"

		case StartMarketTimers =>
			createMovementRecords = system.scheduler.scheduleWithFixedDelay(Duration.Zero, 1 minute, marketActor, Create_New_Movement_Record)
			deleteOldMovementRecords = system.scheduler.scheduleWithFixedDelay(Duration.Zero, 10 days, marketActor, Delete_Earliest_Movement_Records)

		case StopMarketTimers =>
			createMovementRecords.cancel()
			deleteOldMovementRecords.cancel()

	}
}
