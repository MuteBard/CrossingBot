package Logic

import Dao.BugOperations
import Dao.FishOperations
import Routes.ToExpress
import akka.actor.{Actor, ActorLogging, ActorSystem, Props}

import scala.util.Random


object Main extends App{

	case object Crossingbot{

		//CREATE
		case object Create_Animals_All

		//READ
		case object Read_Bug_All
		case object Read_Bug_By_Random
		case class Read_Bug_By_Id(id : Int)
		case class Read_Bug_By_Month(list : List[String])

		case object Read_Fish_All
		case object Read_Fish_By_Random
		case class Read_Fish_By_Id(id : Int)
		case class Read_Fish_By_Month(list : List[String])
	}

	class Crossingbot extends Actor with ActorLogging{
		import Crossingbot._
		override def receive: Receive = {

			case Read_Bug_All =>
				log.info("Collecting all Bugs")
				sender() ! BugOperations.readAll

			case Read_Bug_By_Random =>
				val random = new Random()
				val bId = s"B${random.nextInt(72)+1}"
				log.info(s"Selecting bug $bId at random")
				sender() ! BugOperations.readbyId(bId)

			case Read_Bug_By_Id(id : Int) =>
				val bId = s"B$id"
				log.info(s"Selecting bug $bId")
				sender() ! BugOperations.readbyId(bId)

			case Read_Bug_By_Month(list : List[String]) =>
				sender() ! BugOperations.readbyMonth(list)

			case Read_Fish_All =>
				log.info("Collecting all Fishes")
				sender() ! FishOperations.readAll

			case Read_Fish_By_Random =>
				val random = new Random()
				val fId = s"F${random.nextInt(72)+1}"
				log.info(s"Selecting fish $fId at random")
				sender() ! FishOperations.readbyId(fId)

			case Read_Fish_By_Id(id : Int) =>
				val fId = s"F$id"
				log.info(s"Selecting fish $fId")
				sender() ! FishOperations.readbyId(fId)

			case Read_Fish_By_Month(list : List[String]) =>
				sender() ! FishOperations.readbyMonth(list)

			case Create_Animals_All =>
				log.info("Inserting Bugs and Fishes in MongoDB")
				BugOperations.createAll
				FishOperations.createAll
		}
	}

	implicit val system = ActorSystem("CBAS")
	val crossingbot = system.actorOf(Props[Crossingbot])

	ToExpress

}