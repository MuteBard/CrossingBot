package Actors

import Dao.FishOperations
import akka.actor.{Actor, ActorLogging}
import scala.util.Random

object FishActor {
	case object Read_Fish_All
	case class Read_One_Fish_By_Id(id : Int)
	case class Read_One_Fish_By_Random(month : List[String])
	case class Read_All_Fish_By_Month(month : List[String])
	case class Read_All_Rarest_Fish_By_Month(month : List[String])
}

class FishActor extends Actor with ActorLogging{
	import FishActor._

	override def receive: Receive = {
		case Read_Fish_All =>
			log.info("Collecting all Fishes")
			sender() ! FishOperations.readAll()

		case Read_One_Fish_By_Random(month : List[String]) =>
			log.info(s"Selecting fish at random")
			sender() ! FishOperations.readOneByRarityAndMonth(rarityValue, month)

		case Read_One_Fish_By_Id(id : Int) =>
			val fId = s"F$id"
			log.info(s"Selecting fish $fId")
			sender() ! FishOperations.readOneById(fId)

		case Read_All_Fish_By_Month(month : List[String]) =>
			sender() ! FishOperations.readAllByMonth(month)

		case Read_All_Rarest_Fish_By_Month(month : List[String]) =>
			sender() ! FishOperations.readAllRarestByMonth(month)

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
