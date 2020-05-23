package Actors

import Dao.UserOperations
import Initializer.bugActor
import Initializer.fishActor
import Initializer.marketActor
import Model.Bug_._
import Model.Fish_._
import Model.Pocket_.Pocket
import Model.TurnipTransaction_.TurnipTransaction
import Model.User_._
import Auxillary.Time._
import akka.actor.{Actor, ActorLogging}
import akka.util.Timeout

import scala.concurrent.Await
import scala.concurrent.duration._
import akka.pattern.ask
import scala.language.postfixOps


object UserActor {
//	case class Create_One_User(user : User )
	case class Read_One_User(username : String)
	case class Read_One_User_With_Pending_Turnip_Transaction(username : String, business : String, quantity : Int)
	case class FinalizeUserCreation(username:  String, id : Int, avatar : String)
	case class Update_One_User_With_Executing_Turnip_Transaction(username : String, business: String, quantity : Int, marketPrice: Int, totalBells: Int)
	case class Update_One_User_With_Creature(username : String, species: String)
	case class Delete_One_Creature_From_Pocket(username: String, species : String, creatureName : String)
	case class Delete_One_Creature_From_Pocket_By_Name(username: String, creatureName : String)
	case class Delete_All_Bugs_From_Pocket(username: String)
	case class Delete_All_Fishes_From_Pocket(username: String)
	case class Delete_All_Creatures_From_Pocket(username: String)
}

class UserActor extends Actor with ActorLogging{
	final val BUG = "bug"
	final val FISH = "fish"
	import UserActor._
	implicit val timeout = Timeout(5 seconds)
	override def receive: Receive = {

		case Read_One_User(username) =>
			log.info(s"[Read_One_User] Getting USER with username $username")

			val userSeq = UserOperations.readOneUser(username)
			val userExists = userSeq.nonEmpty

			if (userExists) {
				log.info(s"[Read_One_User] USER $username found")

				if (userSeq.head.liveTurnips.business != ""){
					val user = userSeq.head
					val liveTurnip = user.liveTurnips
					val transactionHistory = user.turnipTransactionHistory
					val marketTurnipPrice = Await.result((marketActor ? MarketActor.Request_Turnip_Price).mapTo[Int], 5 seconds)
					val netGainLossAsBells = (marketTurnipPrice * liveTurnip.quantity) - (liveTurnip.marketPrice * liveTurnip.quantity)
					val netGainLossAsPercentage = ((netGainLossAsBells.toDouble / (marketTurnipPrice * liveTurnip.quantity).toDouble) * 100).toInt
					val newLiveTurnip = TurnipTransaction(liveTurnip.business,liveTurnip.quantity,liveTurnip.marketPrice, liveTurnip.totalBells, liveTurnip.status, netGainLossAsBells, netGainLossAsPercentage)
					val newLatestTransaction = TurnipTransaction(
						transactionHistory.head.business,
						transactionHistory.head.quantity,
						transactionHistory.head.marketPrice,
						transactionHistory.head.totalBells,
						transactionHistory.head.status,
						netGainLossAsBells,
						netGainLossAsPercentage
					)
					val newTransactionHistory = newLatestTransaction +: transactionHistory.takeRight(transactionHistory.length - 1)
					val newUser = User(user.id, user.username, user.fishingPoleLvl, user.bugNetLvl, user.bells,
						user.pocket, newLiveTurnip, newTransactionHistory, user.avatar)

					log.info(s"[Read_One_User] Returning modified USER $username")
					sender() !  UserOperations.updateTurnipTransactionStatsUponRetrieval(newUser)
				}else{
					log.info(s"[Read_One_User] Returning USER $username")
					sender() ! userSeq.head
				}
			} else {
				log.info(s"[Read_One_User] USER $username does not exist")
				sender() ! User(id = -2)
			}

		case Read_One_User_With_Pending_Turnip_Transaction(username, business, quantity) =>
			log.info(s"[Read_One_User_Pending_Turnip_Transaction] Inquiring MarketActor of turnip prices")

			val marketPrice = Await.result((marketActor ? MarketActor.Request_Turnip_Price).mapTo[Int], 5 seconds)
			val totalBells = marketPrice * quantity
			val userSeq = UserOperations.readOneUser(username)
			if (userSeq.nonEmpty) {
				log.info(s"[Read_One_User] USER $username found")
				val user = userSeq.head
				if (business.toLowerCase == "buy") {
					if (quantity <= 0) {
						sender() ! TurnipTransaction(business, 0, marketPrice, 0, "Bad request: Quantity below 1")
					}else if (totalBells <= user.bells) {
						sender() ! TurnipTransaction(business, quantity, marketPrice, totalBells, "Authorized")
					} else {
						sender() ! TurnipTransaction(business, quantity, marketPrice, totalBells, "Unauthorized - Insufficient bells")
					}
				} else if (business.toLowerCase == "sell") {
					if (quantity <= 0) {
						sender() ! TurnipTransaction(business, 0, marketPrice, 0, "Bad request: Quantity below 1")
					} else if (quantity <= user.liveTurnips.quantity) {
						sender() ! TurnipTransaction(business, quantity, marketPrice, totalBells, "Authorized")
					} else {
						sender() ! TurnipTransaction(business, quantity, marketPrice, totalBells, "Unauthorized - Insufficient turnips")
					}
				}else{
					sender() ! TurnipTransaction(business, quantity, marketPrice, 0, "Bad request - Business must be 'buy' or 'sell'")
				}
			} else {
				sender() ! TurnipTransaction(business, 0, 0, 0, "Unauthorized - User does not exist")
			}

		case Update_One_User_With_Executing_Turnip_Transaction(username, business, quantity, marketPrice, totalBells) =>
			log.info(s"[Update_One_User_With_Executing_Turnip_Transaction] Confirming pending transaction")
			val user = UserOperations.readOneUser(username).head
			if(user.liveTurnips.business == ""){
				val liveTurnips = TurnipTransaction(
					business,
					quantity,
					marketPrice,
					totalBells,
					"Authorized"
				)
				val turnipTransactionHistory = List(liveTurnips)
				val updatedUserBells = user.bells - totalBells

				marketActor ! MarketActor.Update_Stalks_Purchased(quantity, business)
				val updatedUser = User(user.id, user.username, user.fishingPoleLvl, user.bugNetLvl, updatedUserBells,
				user.pocket, liveTurnips, turnipTransactionHistory, user.avatar)
				UserOperations.updateOneUserTransaction(updatedUser)
				sender() ! "Success"

			}else{

				if(business == "buy"){
					//average out the market prices
					val newTotalTurnipBells = user.liveTurnips.totalBells + totalBells
					val newQuantity = user.liveTurnips.quantity + quantity
					val newUserMarketAverage = newTotalTurnipBells / newQuantity //aware of loss, just truncating for now

					val liveTurnips = TurnipTransaction(
						business,
						newQuantity ,
						newUserMarketAverage,
						newTotalTurnipBells,
						"Authorized"
					)
					val turnipTransactionRecord = TurnipTransaction(
						business,
						quantity,
						marketPrice,
						newTotalTurnipBells,
						"Authorized"
					)
					val turnipTransactionHistory  = turnipTransactionRecord +: user.turnipTransactionHistory

					val updatedUserBells = user.bells - totalBells
					marketActor ! MarketActor.Update_Stalks_Purchased(quantity, business)
					val updatedUser = User(user.id, user.username, user.fishingPoleLvl, user.bugNetLvl, updatedUserBells,
					user.pocket, liveTurnips, turnipTransactionHistory, user.avatar)
					UserOperations.updateOneUserTransaction(updatedUser)
					sender() ! "Success"

				}else if(business == "sell") {
					val newTotalTurnipBells = user.liveTurnips.totalBells - totalBells
					val newQuantity = user.liveTurnips.quantity - quantity

					val liveTurnips = TurnipTransaction(
						business,
						newQuantity,
						marketPrice,
						newTotalTurnipBells,
						"Authorized"
					)

					val turnipTransactionRecord = TurnipTransaction(
						business,
						quantity,
						marketPrice,
						totalBells,
						"Authorized"
					)

					val turnipTransactionHistory  = turnipTransactionRecord +: user.turnipTransactionHistory
					val updatedBells = user.bells + totalBells
					marketActor ! MarketActor.Update_Stalks_Purchased(quantity, business)

					if(newQuantity != 0){
						val updatedUser = User(user.id, user.username, user.fishingPoleLvl, user.bugNetLvl, updatedBells,
						user.pocket, liveTurnips, turnipTransactionHistory, user.avatar)
						UserOperations.updateOneUserTransaction(updatedUser)
						sender() ! "Success"
					}else{
						val updatedUser = User(user.id, user.username, user.fishingPoleLvl, user.bugNetLvl, updatedBells,
							user.pocket, TurnipTransaction(business = "sell"), turnipTransactionHistory, user.avatar)
						 UserOperations.updateOneUserTransaction(updatedUser)
						sender() ! "Success"
					}

				}
				else {
					sender() ! "Failure"
				}
			}

		case Update_One_User_With_Creature(username, species) =>
			val merge : (String, String) => String = (s1, s2) => s1 + s2+" "
			if(species.toLowerCase() == BUG){
				val bug = Await.result((bugActor ? BugActor.Read_One_Bug_By_Random()).mapTo[Bug], 2 seconds)
				log.info(s"[Update_One_User_With_Creature] Verifying if USER with username $username exists")
				val userSeq = UserOperations.readOneUser(username)
				val pocket = Pocket(List(bug), List())
				if(userSeq.nonEmpty && bug.id != -1){
					val user = userSeq.head
					log.info(s"[Update_One_User_With_Creature] $username exists, checking if user has more than 10 bugs")
					if(user.pocket.bug.length < 10){
						log.info(s"[Update_One_User_With_Creature] Updating pocket")
						UserOperations.updateUserPocket(userSeq.head, species, pocket)
						sender() ! s"Success | Update | {#name#:#${bug.name}#,#bells#:#${bug.bells}#,#rarity#:#${bug.rarity}#,#availability#:#${bug.availability.fold("")(merge).trim()}#,#img#:#${bug.img}#}"
					}else{
						log.info(s"[Update_One_User_With_Creature] $username has more than 10 bugs")
						sender() ! "BugOverflow"
					}

				}else if(userSeq.isEmpty){
					log.info(s"[Update_One_User_With_Creature] $username does not exist, creating user")
					val newUser = User(username = username, pocket = pocket)
					UserOperations.createOneUser(newUser)
					sender() ! s"Success | Create | {#name#:#${bug.name}#,#bells#:#${bug.bells}#,#rarity#:#${bug.rarity}#,#availability#:#${bug.availability.fold("")(merge).trim()}#,#img#:#${bug.img}#}"
				}else{
					log.info(s"[Update_One_User_With_Creature] month entered is invalid")
					sender() ! "Failed"
				}
			}else if(species.toLowerCase() == FISH){
				val fish = Await.result((fishActor ? FishActor.Read_One_Fish_By_Random()).mapTo[Fish], 2 seconds)
				log.info(s"[Update_One_User_With_Creature] Verifying if USER with username $username exists")
				val userSeq = UserOperations.readOneUser(username)
				val pocket = Pocket(List(), List(fish))
				if(userSeq.nonEmpty && fish.id != -1){
					val user = userSeq.head
					log.info(s"[Update_One_User_With_Creature] $username exists, checking if user has more than 10 fish")
					if(user.pocket.fish.length < 10){
						log.info(s"[Update_One_User_With_Creature] Updating pocket")
						UserOperations.updateUserPocket(userSeq.head, species, pocket)
						sender() ! s"Success | Update | {#name#:#${fish.name}#,#bells#:#${fish.bells}#,#rarity#:#${fish.rarity}#,#availability#:#${fish.availability.fold("")(merge).trim()}#,#img#:#${fish.img}#}"
					}else{
						log.info(s"[Update_One_User_With_Creature] $username has more than 10 fishes")
						sender() ! "FishOverflow"
					}
				}else if (userSeq.isEmpty){
					log.info(s"[Update_One_User_With_Creature] $username does not exist, creating user")
					val newUser = User(username = username, pocket = pocket)
					UserOperations.createOneUser(newUser)
					sender() ! s"Success | Create | {#name#:#${fish.name}#,#bells#:#${fish.bells}#,#rarity#:#${fish.rarity}#,#availability#:#${fish.availability.fold("")(merge).trim()}#,#img#:#${fish.img}#}"
				}else{
					log.info(s"[Update_One_User_With_Creature] month entered is invalid")
					sender() ! "Failed"
				}
			}else{
				log.info(s"[Update_One_User_With_Creature] species entered is invalid")
				sender() ! "Failed"
			}

		case FinalizeUserCreation(username, id, avatar) =>
			log.info(s"[FinalizeUserCreation] retrieving user $username")
			val user = UserOperations.readOneUser(username)
			if(user.nonEmpty){
				log.info(s"[FinalizeUserCreation] Finalizing $username's data")
				UserOperations.finalizeCreateOneUser(username, id, avatar)
				sender() ! "Success"
			}else{
				log.info(s"[FinalizeUserCreation] One of the parameters was Invalid")
				sender() ! "Failed"
			}

		case Delete_One_Creature_From_Pocket(username, species, creatureName) =>
			log.info(s"[Delete_One_Creature_From_Pocket] Selling and deleting $creatureName in $username's pocket")
			if (species == BUG){
				val creatureBells =  Await.result((bugActor ? BugActor.Read_One_Bug_By_Name(creatureName)).mapTo[Bug], 3 seconds).bells
				UserOperations.deleteOneForUser(username, creatureName, creatureBells)
				sender() ! creatureBells
			}else if (species == FISH){
				val creatureBells = Await.result((fishActor ? FishActor.Read_One_Fish_By_Name(creatureName)).mapTo[Fish], 3 seconds).bells
				UserOperations.deleteOneForUser(username, creatureName, creatureBells)
				sender() ! creatureBells
			}

		case Delete_All_Bugs_From_Pocket(username) =>
			log.info(s"[Delete_All_Bugs_From_Pocket] Selling and deleting all creatures from $username's pocket")
			val BugBells = UserOperations.deleteAllCreatureForUser(username, BUG)
			sender() ! BugBells

		case Delete_All_Fishes_From_Pocket(username) =>
			log.info(s"[Delete_All_Fishes_From_Pocket] Selling and deleting all creatures from $username's pocket")
			val FishBells = UserOperations.deleteAllCreatureForUser(username, FISH)
			sender() ! FishBells

		case Delete_All_Creatures_From_Pocket(username) =>
			log.info(s"[Delete_All_Creature_From_Pocket] Selling and deleting all creatures from $username's pocket")
			val creatureBells = UserOperations.deleteAllForUser(username)
			sender() ! creatureBells
	}

}