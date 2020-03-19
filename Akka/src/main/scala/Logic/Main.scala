package Logic

import Dao.BugOperations
import Dao.FishOperations
import Routes.ToExpress
import akka.actor.{Actor, ActorLogging, ActorSystem, Props}


object Main extends App{

	case object Crossingbot{
		case object Create_DB_Animals
		case object Read_All_Bugs
		case object Read_All_Fishes
	}

	class Crossingbot extends Actor with ActorLogging{
		import Crossingbot._
		override def receive: Receive = {
			case Create_DB_Animals =>
				log.info("Inserting Bugs and Fishes in MongoDB")
				BugOperations.BulkInsert
				FishOperations.BulkInsert

			case Read_All_Bugs =>
				log.info("Collecting all Bugs")
				sender() ! BugOperations.retrieveAll

			case Read_All_Fishes =>
				log.info("Collecting all Fishes")
				sender() ! FishOperations.retrieveAll
		}
	}

	implicit val system = ActorSystem("CBAS")
	val crossingbot = system.actorOf(Props[Crossingbot])

	ToExpress



}