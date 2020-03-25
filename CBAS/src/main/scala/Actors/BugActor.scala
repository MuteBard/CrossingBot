package Actors

import Dao.BugOperations
import akka.actor.{Actor, ActorLogging}
import scala.util.Random

object BugActor {
	case object Read_Bug_All
	case class Read_One_Bug_By_Id(id : Int)
	case class Read_One_Bug_By_Random(months : List[String])
	case class Read_All_Bug_By_Month(months : List[String])
	case class Read_All_Rarest_Bug_By_Month(month : List[String])
}

class BugActor extends Actor with ActorLogging{
	import BugActor._

	override def receive: Receive = {
		case Read_Bug_All =>
			log.info("Collecting all Bugs")
			sender() ! BugOperations.readAll()

		case Read_One_Bug_By_Random(months : List[String]) =>
			log.info(s"Selecting bug at random")
			sender() ! BugOperations.readOneByRarityAndMonth(rarityValue, months)

		case Read_One_Bug_By_Id(id : Int) =>
			val bId = s"B$id"
			log.info(s"Selecting bug $bId")
			sender() ! BugOperations.readOneById(bId)

		case Read_All_Bug_By_Month(months : List[String]) =>
			sender() ! BugOperations.readAllByMonth(months)

		case Read_All_Rarest_Bug_By_Month(months : List[String]) =>
			sender() ! BugOperations.readAllRarestByMonth(months)
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
