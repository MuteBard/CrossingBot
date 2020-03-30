package Actors

import App.Main._
import Actors.MarketActor._
import Dao.{BugOperations, FishOperations}
import system.dispatcher

import scala.concurrent.duration._
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
			log.info("[StartMarketTimers] Starting Scheduler Jobs")
			createMovementRecords = system.scheduler.scheduleWithFixedDelay(Duration.Zero, 1 minute, marketActor, Create_New_Movement_Record)
			deleteOldMovementRecords = system.scheduler.scheduleWithFixedDelay(60 days, 10 days, marketActor, Delete_Earliest_Movement_Records)

		case StopMarketTimers =>
			log.info("[StartMarketTimers] Stopping Scheduler Jobs")
			//TODO handle null with option
			createMovementRecords.cancel()
			deleteOldMovementRecords.cancel()

	}
}
