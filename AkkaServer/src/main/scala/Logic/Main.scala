package Logic

import Dao.BugOperations
import Dao.FishOperations
import Routes.ToExpress
import akka.actor.{Actor, ActorLogging, ActorSystem, Props}

object Main extends App{

	case object Crossingbot{
		case object Populate_DB_Animals
		case object Get_All_Bugs
		case object Get_All_Fishes
	}
	class Crossingbot extends Actor with ActorLogging{
		import Crossingbot._
		override def receive: Receive = {
			case Populate_DB_Animals =>
				log.info("Bulk Insert bugs and fishes things")
				BugOperations.BulkInsert
				FishOperations.BulkInsert
			case Get_All_Bugs =>
				log.info("Collecting all Bugs")
				sender() ! BugOperations.retrieveAll
			case Get_All_Fishes =>
				sender() ! FishOperations.retrieveAll
		}
	}

	implicit val system = ActorSystem("CBAS")
	val crossingbot = system.actorOf(Props[Crossingbot])
	
	ToExpress



}
