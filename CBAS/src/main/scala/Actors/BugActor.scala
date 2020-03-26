package Actors

import Dao.BugOperations
import Model.Major.Bug_.Bug
import akka.actor.{Actor, ActorLogging}

import scala.util.Random

object BugActor {
	case object Read_Bug_All
	case class Read_One_Bug_By_Id(bId : String)
	case class Read_One_Bug_By_Random(months : List[String])
	case class Read_All_Bug_By_Month(months : List[String])
	case class Read_All_Rarest_Bug_By_Month(month : List[String])
}

class BugActor extends Actor with ActorLogging{
	import BugActor._

	override def receive: Receive = {
		case Read_Bug_All =>
			log.info("[Read_Bug_All] Selecting all BUG")
			sender() ! BugOperations.readAll()

		case Read_One_Bug_By_Random(months : List[String]) =>
			val rare = rarityValue
			log.info(s"[Read_One_Bug_By_Random] Selecting BUG by random")
			log.info(s"[Read_One_Bug_By_Random] Rarity value is $rare")

			sender() ! BugOperations.readOneByRarityAndMonth(rare, months)

		case Read_One_Bug_By_Id(bId : String) =>
			log.info(s"[Read_One_Bug_By_Id] Selecting BUG with id : $bId")
			val bugSeq = BugOperations.readOneById(bId)
			val bugExists = bugSeq.nonEmpty
			if(bugExists){
				log.info(s"[Read_One_User] BUG with id $bId found")
				sender() ! bugSeq.head
			}else {
				log.info(s"[Read_One_User] BUG with id $bId does not exist")
				sender() ! Bug()
			}
		case Read_All_Bug_By_Month(months : List[String]) =>
			log.info(s"[Read_All_Bug_By_Month] Selecting BUG based on month(s) provided")
			sender() ! BugOperations.readAllByMonth(months)

		case Read_All_Rarest_Bug_By_Month(months : List[String]) =>
			log.info(s"[Read_All_Rarest_Bug_By_Month] Selecting BUG based on rarity")
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
