package Actors

import Dao.FishOperations
import akka.actor.{Actor, ActorLogging}
import scala.util.Random

object FishActor {
	case object Read_Fish_All
	case class Read_Fish_By_Id(id : Int)
	case class Read_Fish_By_Random(list : List[String])
	case class Read_Fish_By_Month(list : List[String])
}

class FishActor extends Actor with ActorLogging{
	import FishActor._

	override def receive: Receive = {
		case Read_Fish_All =>
			log.info("Collecting all Fishes")
			sender() ! FishOperations.readAll()

		case Read_Fish_By_Random(list : List[String]) =>
			log.info(s"Selecting fish at random")
			sender() ! FishOperations.readByRarityAndMonth(rarityValue, list)

		case Read_Fish_By_Id(id : Int) =>
			val fId = s"F$id"
			log.info(s"Selecting fish $fId")
			sender() ! FishOperations.readById(fId)

		case Read_Fish_By_Month(list : List[String]) =>
			sender() ! FishOperations.readByMonth(list)
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
