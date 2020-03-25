package Actors

import Dao.{BugOperations, FishOperations}
import akka.actor.{Actor, ActorLogging}

object StartActor {
	case object Create_Animals_All
}

class StartActor extends Actor with ActorLogging{
	import StartActor._

	override def receive: Receive = {
		case Create_Animals_All =>
			log.info("Inserting Bugs and Fishes in Database")
			BugOperations.createAll()
			FishOperations.createAll()
	}
}
