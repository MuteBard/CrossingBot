package Routes
import Actors.{BugActor, FishActor, StartActor}
import Logic.Main.system
import Model.Bug_._
import Model.Fish_._
import Model.Months_._
import akka.actor.Props
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives._
import akka.pattern.ask
import akka.util.Timeout
import ch.megard.akka.http.cors.scaladsl.CorsDirectives._

import scala.concurrent.duration._

object ToExpress extends
	BugJsonProtocol with
	FishJsonProtocol with
	MonthsJsonProtocol with
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
							val oneBugFuture = (bugActor ? BugActor.Read_Bug_By_Id(id)).mapTo[List[Bug]]
							complete(oneBugFuture)
						}
					} ~
					path("fishesAll"){
						val AllFishesFuture = (fishActor ? FishActor.Read_Fish_All).mapTo[List[Fish]]
						complete(AllFishesFuture)
					} ~
					path("fishId"/ IntNumber) {
						id => {
							val oneFishFuture = (fishActor ? FishActor.Read_Fish_By_Id(id)).mapTo[List[Fish]]
							complete(oneFishFuture)
						}
					}
				} ~
				post{
					path("bugByMonths"){
						entity(as[Months]) { months =>
							val monthBugsFuture = (bugActor ? BugActor.Read_Bug_By_Month(months.availability)).mapTo[List[Bug]]
							complete(monthBugsFuture)
						}
					} ~
					path("RandomBugByMonth"){
						entity(as[Months]) { months =>
							val oneBugFuture = (bugActor ? BugActor.Read_Bug_By_Random(months.availability)).mapTo[List[Bug]]
							complete(oneBugFuture)
						}
					} ~
					path("fishByMonths"){
						entity(as[Months]) { months =>
							val monthFishesFuture = (fishActor ? FishActor.Read_Fish_By_Month(months.availability)).mapTo[List[Fish]]
							complete(monthFishesFuture)
						}
					} ~
					path("RandomFishByMonth") {
						entity(as[Months]) { months =>
							val oneFishFuture = (fishActor ? FishActor.Read_Fish_By_Random(months.availability)).mapTo[List[Fish]]
							complete(oneFishFuture)
						}
					}
				}
			}
		}


	Http().bindAndHandle(toExpressRoutes, "localhost", 4774)
}

