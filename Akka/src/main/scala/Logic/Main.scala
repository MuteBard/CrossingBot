package Logic

import Dao.BugOperations
import Dao.FishOperations

import akka.actor.{Actor, ActorLogging, ActorSystem, Props}

object Main extends App{
	implicit val system = ActorSystem("CBAS")
	val cb = system.actorOf(Props[Crossingbot])

	cb ! "BulkInsert"

	class Crossingbot extends Actor with ActorLogging{
		override def receive: Receive = {
			case "BulkInsert" =>
				log.info("Bulk Insert bugs and fishes things")
				BugOperations.BulkInsert
				FishOperations.BulkInsert

		}
	}
}
