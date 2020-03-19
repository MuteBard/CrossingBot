package Routes
import Model.Bug_._
import Model.Fish_._
import Model.Months_._
import Logic.Main._
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives._
import akka.pattern.ask
import akka.util.Timeout

import scala.concurrent.duration._
import ch.megard.akka.http.cors.scaladsl.CorsDirectives._


object ToExpress extends
	BugJsonProtocol with
	FishJsonProtocol with
	MonthsJsonProtocol with
	SprayJsonSupport {

	import system.dispatcher

	implicit val timeout = Timeout(5 seconds)
	val toExpressRoutes =
		cors(){
			pathPrefix("api"){
				get{
					path("repopulate"){
						crossingbot ! Crossingbot.Create_Animals_All
						complete(StatusCodes.OK)
					} ~ //
					path("bugAll") {
						val AllBugsFuture = (crossingbot ? Crossingbot.Read_Bug_All).mapTo[List[Bug]]
						complete(AllBugsFuture)
					} ~
					path("bugId"/ IntNumber) {
						id => {
							val oneBugFuture = (crossingbot ? Crossingbot.Read_Bug_By_Id(id)).mapTo[List[Bug]]
							complete(oneBugFuture)
						}
					} ~
					path("bugId" / "random"){
						val oneBugFuture = (crossingbot ? Crossingbot.Read_Bug_By_Random).mapTo[List[Bug]]
						complete(oneBugFuture)
					} ~
					path("fishesAll"){
						val AllFishesFuture = (crossingbot ? Crossingbot.Read_Fish_All).mapTo[List[Fish]]
						complete(AllFishesFuture)
					} ~
					path("fishId"/ IntNumber) {
						id => {
							val oneFishFuture = (crossingbot ? Crossingbot.Read_Bug_By_Id(id)).mapTo[List[Fish]]
							complete(oneFishFuture)
						}
					} ~
					path("fishId" / "random"){
						val oneFishFuture = (crossingbot ? Crossingbot.Read_Bug_By_Random).mapTo[List[Fish]]
						complete(oneFishFuture)
					}
				} ~
				post{
					path("bugByMonths"){
						entity(as[Months]) { months => // will unmarshal JSON to Order
							val monthBugsFuture = (crossingbot ? Crossingbot.Read_Bug_By_Month(months.availability)).mapTo[List[Bug]]
							complete(monthBugsFuture)
						}
					} ~
					path("fishByMonths"){
						entity(as[Months]) { months => // will unmarshal JSON to Order
							val monthFishesFuture = (crossingbot ? Crossingbot.Read_Fish_By_Month(months.availability)).mapTo[List[Fish]]
							complete(monthFishesFuture)
						}
					}
				}
			}
		}


	Http().bindAndHandle(toExpressRoutes, "localhost", 4774)
}

