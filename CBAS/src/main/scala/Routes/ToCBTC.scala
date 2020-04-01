package Routes
import Actors.{BugActor, FishActor, MarketActor, StartActor, UserActor}
import App.Main._
import Model.Major.Pocket_._
import Model.Minor.Months_._
import Model.Major.Bug_._
import Model.Major.Fish_._
import Model.Major.MovementRecord_._
import Model.Major.User_._
import Model.Minor.CreatureSell_._
import Model.Minor.PendingTurnipTransaction_._
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives._
import akka.pattern.ask
import akka.util.Timeout
import ch.megard.akka.http.cors.scaladsl.CorsDirectives._

import scala.concurrent.Await
import scala.concurrent.duration._

object ToCBTC extends
	UserJsonProtocol with
	BugJsonProtocol with
	FishJsonProtocol with
	MonthsJsonProtocol with
	PocketJsonProtocol with
	CreatureSellJsonProtocol with
	MovementRecordJsonProtocol with
	PendingTurnipTransactionJsonProtocol with
	SprayJsonSupport {

	import system.dispatcher

	implicit val timeout = Timeout(5 seconds)
	final val BUG = "bug"
	final val FISH = "fish"

	val routes =
		cors(){
			pathPrefix("api"){
				get{
					path("addAllBugFish"){
						startupActor ! StartActor.Create_Creatures_All
						complete(StatusCodes.OK)
					} ~
					path("startMarket"){
						startupActor ! StartActor.Start_Market_Timers
						complete(StatusCodes.OK)
					} ~
					path("stopMarket"){
						startupActor ! StartActor.Stop_Market_Timers
						complete(StatusCodes.OK)
					} ~
					path("list" / Segment) {
						creatureType => {
							if (creatureType == BUG || creatureType == FISH) {
								if (creatureType == BUG) {
									val AllBugsFuture = (bugActor ? BugActor.Read_Bug_All).mapTo[List[Bug]]
									complete(AllBugsFuture)
								}else{
									val AllFishFuture = (fishActor ? FishActor.Read_Fish_All).mapTo[List[Fish]]
									complete(AllFishFuture)
								}
							}else{
								complete(StatusCodes.BadRequest)
							}
						}
					} ~
					path("creatureId" / Segment) {
						id => {
							if (id.substring(0,1) == "B" || id.substring(0,1) == "F") {
								if (id.substring(0,1) == "B") {
									val oneBug = Await.result((bugActor ? BugActor.Read_One_Bug_By_Id(id.toUpperCase)).mapTo[Bug], 2 seconds)
									if (oneBug.name != "NULL/BUG") complete(oneBug)
									else complete(StatusCodes.NotFound, s"Bug with id $id does not exist")
								} else {
									val oneFish = Await.result((fishActor ? FishActor.Read_One_Fish_By_Id(id.toUpperCase)).mapTo[Fish], 2 seconds)
									if (oneFish.name != "NULL/FISH") complete(oneFish)
									else complete(StatusCodes.NotFound, s"Fish with id $id does not exist")
								}
							} else {
								complete(StatusCodes.BadRequest)
							}
						}
					} ~
					path("user" / Segment) {
						username => {
							val oneUser : User = Await.result((userActor ? UserActor.Read_One_User(username)).mapTo[User], 2 seconds)
							if (oneUser.username != "NULL/USER") complete(oneUser)
							else complete(StatusCodes.NotFound, s"User $username does not exist")
						}
					} ~
					path("turnips"){
						val turnipPrice = Await.result((marketActor ? MarketActor.Request_Turnip_Price).mapTo[Int], 3 seconds)
						complete(StatusCodes.OK, ""+turnipPrice)
					} ~
					path("latestMarketDay"){
						val MovementRecord = Await.result((marketActor ? MarketActor.Read_Latest_Movement_Record_Day).mapTo[MovementRecord], 3 seconds)
						complete(MovementRecord)
					} ~
					path("latestMarketMonth"){
						val MovementRecordList = Await.result((marketActor ? MarketActor.Read_Selected_Movement_Records_Month).mapTo[List[MovementRecord]], 3 seconds)
						complete(MovementRecordList)
					}
				} ~
				post{
						path("retrieveOneByMonth" / Segment){
						creatureType => {
							if (creatureType == BUG || creatureType == FISH) {
								entity(as[Months]) { months =>
									if(creatureType == BUG){
										val oneBugFuture = (bugActor ? BugActor.Read_One_Bug_By_Random(months.availability)).mapTo[Bug]
										complete(oneBugFuture)
									}else{
										val oneFishFuture = (fishActor ? FishActor.Read_One_Fish_By_Random(months.availability)).mapTo[Fish]
										complete(oneFishFuture)
									}
								}
							} else {
								complete(StatusCodes.BadRequest)
							}
						}
					} ~
					path("listByMonth" / Segment){
						creatureType => {
							if(creatureType == BUG || creatureType == FISH) {
								entity(as[Months]) { months =>
									if(creatureType == BUG){
										val monthBugsFuture = (bugActor ? BugActor.Read_All_Bug_By_Month(months.availability)).mapTo[List[Bug]]
										complete(monthBugsFuture)
									}else{
										val monthFishesFuture = (fishActor ? FishActor.Read_All_Fish_By_Month(months.availability)).mapTo[List[Fish]]
										complete(monthFishesFuture)
									}
								}
							}else{
								complete(StatusCodes.BadRequest)
							}
						}
					} ~
					path("listRarestByMonth" / Segment) {
						creatureType => {
							if (creatureType == BUG || creatureType == FISH) {
								entity(as[Months]) { months =>
									if(creatureType == BUG){
										val rarestBugFuture = (bugActor ? BugActor.Read_All_Rarest_Bug_By_Month(months.availability)).mapTo[List[Bug]]
										complete(rarestBugFuture)
									}else{
										val rarestFishFuture = (fishActor ? FishActor.Read_All_Rarest_Fish_By_Month(months.availability)).mapTo[List[Fish]]
										complete(rarestFishFuture)
									}
								}
							} else {
								complete(StatusCodes.BadRequest)
							}
						}
					} ~
					path("addToPocket"){
						entity(as[User]) { user =>
							val userExists : Boolean = Await.result((userActor ? UserActor.Update_One_User_With_Creature(user)).mapTo[Boolean], 3 seconds)
							if (userExists) complete("Success, updated user's pocket")
							else complete("Incomplete, user does not exist. Need to create user to associate to pocket")
						}
					} ~
					path("addUser"){
						entity(as[User]) { user =>
							userActor ! UserActor.Create_One_User(user)
							complete("Success, created user")
						}
					} ~
					path("sell" / "one"){
						entity(as[CreatureSell]){ selling : CreatureSell=>
							val bells : Int = Await.result((userActor ? UserActor.Delete_One_Creature_From_Pocket(selling)).mapTo[Int], 3 seconds)
							complete(StatusCodes.OK, ""+bells)
						}
					} ~
					path("sell" / "all"){
						entity(as[CreatureSell]){ selling  : CreatureSell=>
							val bells : Int = Await.result((userActor ? UserActor.Delete_All_Creature_From_Pocket(selling)).mapTo[Int], 3 seconds)
							complete(StatusCodes.OK, ""+bells)
						}
					} ~
					path("pendingTurnipTransaction"){
						entity(as[PendingTurnipTransaction]){ turnipTransaction =>
							val turnipInqury : PendingTurnipTransaction = Await.result((userActor ? UserActor.Read_One_User_With_Pending_Turnip_Transaction(turnipTransaction)).mapTo[PendingTurnipTransaction], 5 seconds)
							complete(StatusCodes.OK, turnipInqury)
						}
					} ~
					path("executingTurnipTransaction"){
						entity(as[PendingTurnipTransaction]){ turnipTransaction =>
							val oneUser : User = Await.result((userActor ? UserActor.Update_One_User_With_Executing_Turnip_Transaction(turnipTransaction)).mapTo[User], 2 seconds)
							complete(oneUser)
						}
					}
				}
			}
		}

	Http().bindAndHandle(routes, "localhost", 4774)
}

