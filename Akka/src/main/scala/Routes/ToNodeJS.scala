package Routes
import Actors.{BugActor, FishActor, StartActor}
import Logic.Main.system
import Model.Inbound.AddingFish_._
import Model.Inbound.AddingBug_._
import Model.Inbound.Months_._
import Model.OutBound.Bug_._
import Model.OutBound.Fish_._
import akka.actor.Props
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives._
import akka.pattern.ask
import akka.util.Timeout
import ch.megard.akka.http.cors.scaladsl.CorsDirectives._

import scala.concurrent.duration._

object ToNodeJS extends
	BugJsonProtocol with
	FishJsonProtocol with
	MonthsJsonProtocol with
	AddingBugJsonProtocol with
	AddingFishJsonProtocol with
	SprayJsonSupport {


	val startupActor = system.actorOf(Props[StartActor])
	val bugActor = system.actorOf(Props[BugActor])
	val fishActor = system.actorOf(Props[FishActor])
	import system.dispatcher

	implicit val timeout = Timeout(5 seconds)
	val toExpressRoutes =
		cors(){
			pathPrefix("api"){
				get{
					path("repopulate"){
						startupActor ! StartActor.Create_Animals_All
						complete(StatusCodes.OK)
					} ~ //
					path("bugAll") {
						val AllBugsFuture = (bugActor ? BugActor.Read_Bug_All).mapTo[List[Bug]]
						complete(AllBugsFuture)
					} ~
					path("bugId"/ IntNumber) {
						id => {
							val oneBugFuture = (bugActor ? BugActor.Read_One_Bug_By_Id(id)).mapTo[List[Bug]]
							complete(oneBugFuture)
						}
					} ~
					path("fishesAll"){
						val AllFishesFuture = (fishActor ? FishActor.Read_Fish_All).mapTo[List[Fish]]
						complete(AllFishesFuture)
					} ~
					path("fishId"/ IntNumber) {
						id => {
							val oneFishFuture = (fishActor ? FishActor.Read_One_Fish_By_Id(id)).mapTo[List[Fish]]
							complete(oneFishFuture)
						}
					}
				} ~
				post{
					path("ListBugByMonths"){
						entity(as[Months]) { months =>
							val monthBugsFuture = (bugActor ? BugActor.Read_All_Bug_By_Month(months.availability)).mapTo[List[Bug]]
							complete(monthBugsFuture)
						}
					} ~
					path("SingleRandomBugByMonths"){
						entity(as[Months]) { months =>
							val oneBugFuture = (bugActor ? BugActor.Read_One_Bug_By_Random(months.availability)).mapTo[List[Bug]]
							complete(oneBugFuture)
						}
					} ~
					path("ListRarestBugByMonths"){
						entity(as[Months]) { months =>
							val rarestBugFuture = (bugActor ? BugActor.Read_All_Rarest_Bug_By_Month(months.availability)).mapTo[List[Bug]]
							complete(rarestBugFuture)
						}
					} ~
					path("ListFishByMonths"){
						entity(as[Months]) { months =>
							val monthFishesFuture = (fishActor ? FishActor.Read_All_Fish_By_Month(months.availability)).mapTo[List[Fish]]
							complete(monthFishesFuture)
						}
					} ~
					path("SingleRandomFishByMonths") {
						entity(as[Months]) { months =>
							val oneFishFuture = (fishActor ? FishActor.Read_One_Fish_By_Random(months.availability)).mapTo[List[Fish]]
							complete(oneFishFuture)
						}
					} ~
					path("ListRarestFishByMonths") {
						entity(as[Months]) { months =>
							val rarestFishFuture = (fishActor ? FishActor.Read_All_Rarest_Fish_By_Month(months.availability)).mapTo[List[Fish]]
							complete(rarestFishFuture)
						}
					} //~
//					path("AddBugInPocket"){
//						entity(as[AddingBug]) {data =>
//							val addBugFuture = (userActor ? UserActor.Update_Add_One_Bug(data.username, data.bug))
//							complete(StatusCodes.OK)
//							complete(StatusCodes.NotFound)
//						}
//					} ~
//					path("AddFishInPocket"){
//						entity(as[AddingFish]) {data =>
//							val addBugFuture = (userActor ? UserActor.Update_Add_One_Fish((data.username, data.bug)))
//							complete(StatusCodes.OK)
//							complete(StatusCodes.NotFound)
//						}
//					} ~
//					path("AddUser"){
//						entity(as[User]) { user =>
//							val createUserFuture = (userActor ? UserActor.Create_One_User(user))
//							complete(StatusCodes.OK)
//							complete(StatusCodes.NotFound)
//						}
//					}
				}
			}
		}


	Http().bindAndHandle(toExpressRoutes, "localhost", 4774)
}

