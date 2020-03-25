package Actors

import Dao.{BugOperations, FishOperations}
import akka.actor.{Actor, ActorLogging}

object StartActor {
	case object Create_Creatures_All
}

class StartActor extends Actor with ActorLogging{
	import StartActor._

	override def receive: Receive = {
		case Create_Creatures_All =>
			log.info("Create_Creatures_All] Inserting all BUG and FISH in Database")
			BugOperations.createAll()
			FishOperations.createAll()
		sender() ! "Completed"
	}
}
