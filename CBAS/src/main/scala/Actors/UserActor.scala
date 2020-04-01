package Actors

import Actors.MarketActor.Update_Stalks_Purchased
import Dao.UserOperations
import App.Main._
import Model.Major.Bug_.Bug
import Model.Major.TurnipTransaction_.TurnipTransaction
import Model.Major.Fish_.Fish
import Model.Major.User_._
import Model.Minor.CreatureSell_.CreatureSell
import Model.Minor.PendingTurnipTransaction_.PendingTurnipTransaction
import akka.actor.{Actor, ActorLogging}
import akka.pattern.ask
import akka.util.Timeout

import scala.concurrent.Await
import scala.concurrent.duration._

object UserActor {
	case class Create_One_User(user : User )
	case class Read_One_User(username : String)
	case class Read_One_User_With_Pending_Turnip_Transaction(turnipTransaction : PendingTurnipTransaction)
	case class Update_One_User_With_Executing_Turnip_Transaction(turnipTransaction : PendingTurnipTransaction)
	case class Update_One_User_With_Creature(user : User)
	case class Delete_One_Creature_From_Pocket(selling : CreatureSell)
	case class Delete_All_Creature_From_Pocket(selling : CreatureSell)

}

class UserActor extends Actor with ActorLogging{
	final val BUG = "bug"
	final val FISH = "fish"
	import UserActor._
	implicit val timeout = Timeout(5 seconds)
	override def receive: Receive = {

		case Create_One_User(user) =>
			log.info(s"[Create_One_User] Inserting USER in database with new creature in pocket")
			UserOperations.createOneUser(user)

		case Read_One_User(username) =>
			log.info(s"[Read_One_User] Getting USER with username $username")

			val userSeq = UserOperations.readOneUser(username)
			val userExists = userSeq.nonEmpty

			if (userExists) {
				log.info(s"[Read_One_User] USER $username found")

				if (userSeq.head.liveTurnips.business != ""){
					val liveTurnip = userSeq.head.liveTurnips
					val marketTurnipPrice = Await.result((marketActor ? MarketActor.Request_Turnip_Price).mapTo[Int], 5 seconds)
					val userTurnipPrice = liveTurnip.marketPrice
					val netGainLossAsBells = marketTurnipPrice - userTurnipPrice
					val netGainLossAsPercentage = (math rint(netGainLossAsBells.toDouble / marketTurnipPrice.toDouble)).toInt
					val newLiveTurnip = TurnipTransaction(liveTurnip.business,liveTurnip.quantity,liveTurnip.marketPrice, liveTurnip.totalBells, netGainLossAsBells, netGainLossAsPercentage)

					log.info(s"[Read_One_User] Returning modified USER")
					sender() !  UserOperations.updateTurnipTransactionStatsUponRetrieval(username, newLiveTurnip)
				}else{
					sender() ! userSeq.head
				}
			} else {
				log.info(s"[Read_One_User] USER $username does not exist")
				sender() ! User()
			}

		//TODO will need to fudge with selling part later
		case Read_One_User_With_Pending_Turnip_Transaction(tt) =>
			log.info(s"[Read_One_User_Pending_Turnip_Transaction] Inquiring MarketActor of turnip prices")
			val turnipPrice = Await.result((marketActor ? MarketActor.Request_Turnip_Price).mapTo[Int], 5 seconds)
			val totalCost = turnipPrice * tt.quantity

			val userSeq = UserOperations.readOneUser(tt.username)
			if (userSeq.nonEmpty) {
				log.info(s"[Read_One_User] USER ${tt.username} found")
				val user = userSeq.head
				if (tt.business == "buy") {
					if (totalCost <= user.bells) {
						sender() ! PendingTurnipTransaction(tt.username, tt.business, tt.quantity, turnipPrice, totalCost, "Authorized")
					} else {
						sender() ! PendingTurnipTransaction(tt.username, tt.business, tt.quantity, turnipPrice, totalCost, "Insufficient bells")
					}
				} else if (tt.business == "sell") {
					if (tt.quantity <= user.turnipTransactionHistory.head.quantity) {
						println(PendingTurnipTransaction(tt.username, tt.business, tt.quantity, turnipPrice, totalCost, "Authorized"))
						sender() ! PendingTurnipTransaction(tt.username, tt.business, tt.quantity, turnipPrice, totalCost, "Authorized")
					} else {
						sender() ! PendingTurnipTransaction(tt.username, tt.business, tt.quantity, turnipPrice, totalCost, "Insufficient turnips")
					}
				}
			} else {
				sender() ! PendingTurnipTransaction(tt.username, tt.business, tt.quantity, turnipPrice, totalCost, "User does not exist")
			}



		case Update_One_User_With_Executing_Turnip_Transaction(pendingTurnipTransaction) =>
			log.info(s"[Update_One_User_With_Executing_Turnip_Transaction] Confirming pending transaction")
			val user = UserOperations.readOneUser(pendingTurnipTransaction.username).head
			println(pendingTurnipTransaction)
			if(user.liveTurnips.business == ""){
				val liveTurnips = TurnipTransaction(
					pendingTurnipTransaction.business,
					pendingTurnipTransaction.quantity,
					pendingTurnipTransaction.marketPrice,
					pendingTurnipTransaction.totalBells,
				)
				val turnipTransactionHistory = List(liveTurnips)
				val updatedBells = user.bells - pendingTurnipTransaction.totalBells
				marketActor ! Update_Stalks_Purchased(pendingTurnipTransaction.quantity, pendingTurnipTransaction.business)
				val newUser = User(user._id, user.username, user.fishingPoleLvl, user.bugNetLvl, updatedBells,
					user.pocket, liveTurnips, turnipTransactionHistory, user.img)
				sender() ! UserOperations.massUpdateOneUser(newUser)

			}else{

				if(pendingTurnipTransaction.business == "buy"){
					//average out the market prices
					val newTotalBells = user.liveTurnips.totalBells + pendingTurnipTransaction.totalBells
					val newQuanity = user.liveTurnips.quantity + pendingTurnipTransaction.quantity
					val newUserMarketAverage = newTotalBells / newQuanity //aware of loss, just truncating for now

					val liveTurnips = TurnipTransaction(
						"buy",
						newQuanity ,
						newUserMarketAverage,
						newTotalBells,
					)
					val liveTurnipTransactionRecord = TurnipTransaction(
						pendingTurnipTransaction.business,
						pendingTurnipTransaction.quantity ,
						pendingTurnipTransaction.marketPrice,
						pendingTurnipTransaction.totalBells,
					)


					val turnipTransactionHistory  = liveTurnipTransactionRecord +: user.turnipTransactionHistory
					val updatedBells = user.bells - pendingTurnipTransaction.totalBells
					marketActor ! Update_Stalks_Purchased(pendingTurnipTransaction.quantity, pendingTurnipTransaction.business)
					val newUser = User(user._id, user.username, user.fishingPoleLvl, user.bugNetLvl, updatedBells,
						user.pocket, liveTurnips, turnipTransactionHistory, user.img)
					sender() ! UserOperations.massUpdateOneUser(newUser)

				}else if(pendingTurnipTransaction.business == "sell") {
					val newTotalBells = user.liveTurnips.totalBells - pendingTurnipTransaction.totalBells
					val newQuantity = user.liveTurnips.quantity - pendingTurnipTransaction.quantity

					val liveTurnips = TurnipTransaction(
						"buy",
						newQuantity,
						pendingTurnipTransaction.marketPrice,
						newTotalBells,
					)

					val liveTurnipTransactionRecord = TurnipTransaction(
						pendingTurnipTransaction.business,
						pendingTurnipTransaction.quantity ,
						pendingTurnipTransaction.marketPrice,
						pendingTurnipTransaction.totalBells,
					)

					val turnipTransactionHistory  = liveTurnipTransactionRecord +: user.turnipTransactionHistory
					val updatedBells = user.bells + pendingTurnipTransaction.totalBells
					marketActor ! Update_Stalks_Purchased(pendingTurnipTransaction.quantity, pendingTurnipTransaction.business)

					if(newQuantity != 0){
						val newUser = User(user._id, user.username, user.fishingPoleLvl, user.bugNetLvl, updatedBells,
							user.pocket, liveTurnips, turnipTransactionHistory, user.img)
						sender() ! UserOperations.massUpdateOneUser(newUser)
					}else{
						val newUser = User(user._id, user.username, user.fishingPoleLvl, user.bugNetLvl, updatedBells,
							user.pocket, TurnipTransaction(), turnipTransactionHistory, user.img)
						sender() ! UserOperations.massUpdateOneUser(newUser)
					}

				}
			}

		//TODO This might need to refactoring
		case Update_One_User_With_Creature(user) =>
			log.info(s"[Update_One_User_With_Creature] Adding BUG/FISH to potential ${user.username}'s pocket")
			UserOperations.updateUserPocket(user)
			log.info(s"[Update_One_User_With_Creature] Verifying if USER with username ${user.username} exists")
			val exists = UserOperations.readOneUser(user.username).length == 1
			if (exists){
				log.info("[Update_One_User_With_Creature] USER exists")
			}else
				log.info("[Update_One_User_With_Creature] USER does not exist")
			sender() ! exists

		case Delete_One_Creature_From_Pocket(selling) =>
			log.info(s"[Delete_One_Creature_From_Pocket] Selling and deleting ${selling.creature} in ${selling.username}'s pocket")
			if (selling.species == BUG){
				val bells =  Await.result((bugActor ? BugActor.Read_One_By_Name(selling.creature)).mapTo[Bug], 3 seconds).bells
				UserOperations.deleteOneForUser(selling, bells)
				sender() ! bells
			}else if (selling.species == FISH){
				val bells = Await.result((fishActor ? FishActor.Read_One_By_Name(selling.creature)).mapTo[Fish], 3 seconds).bells
				UserOperations.deleteOneForUser(selling, bells)
				sender() ! bells
			}

		//Todo remove comments
		case Delete_All_Creature_From_Pocket(selling) =>
			log.info(s"[Delete_All_Creature_From_Pocket] Selling and deleting all creatures from ${selling.username}'s pocket")
//			val bugBells =  Await.result((bugActor ? BugActor.Read_One_By_Name(selling.creature)).mapTo[Bug], 3 seconds).bells
//			val fishBells = Await.result((fishActor ? FishActor.Read_One_By_Name(selling.creature)).mapTo[Fish], 3 seconds).bells
//			val creatureBells = bugBells + fishBells
			sender() ! UserOperations.deleteAllForUser(selling)
	}
}
