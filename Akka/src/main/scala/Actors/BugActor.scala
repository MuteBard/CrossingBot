package Actors

import Dao.BugOperations
import akka.actor.{Actor, ActorLogging}
import scala.util.Random

object BugActor {
	case object Read_Bug_All
	case class Read_Bug_By_Id(id : Int)
	case class Read_Bug_By_Random(list : List[String])
	case class Read_Bug_By_Month(list : List[String])
}

class BugActor extends Actor with ActorLogging{
	import BugActor._

	override def receive: Receive = {
		case Read_Bug_All =>
			log.info("Collecting all Bugs")
			sender() ! BugOperations.readAll()

		case Read_Bug_By_Random(list : List[String]) =>
			log.info(s"Selecting bug at random")
			sender() ! BugOperations.readByRarityAndMonth(rarityValue, list)

		case Read_Bug_By_Id(id : Int) =>
			val bId = s"B$id"
			log.info(s"Selecting bug $bId")
			sender() ! BugOperations.readById(bId)

		case Read_Bug_By_Month(list : List[String]) =>
			sender() ! BugOperations.readByMonth(list)
	}

	def rarityValue : Int = {
		val random = new Random()
		val chance = random.nextInt(512)+1
		if(chance % 500 == 0) 5
		else if (chance % 80 == 0) 4
		else if(chance % 20 == 0) 3
		else if(chance % 3 == 0) 2
		else 1
	}
}
