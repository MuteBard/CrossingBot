package Routes
import Model.Bug_._
import Model.Fish_._
import Logic.Main._
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives._
import akka.pattern.ask
import akka.util.Timeout

import scala.concurrent.duration._

object ToExpress extends
	BugJsonProtocol with
	FishJsonProtocol with
	SprayJsonSupport {

	import system.dispatcher
	implicit val timeout = Timeout(5 seconds)
	val toExpressRoutes =
		pathPrefix("api"){
			get{
				path("populate"){
					complete(StatusCodes.OK)
				} ~
				path("allBugs") {
					val AllBugsFuture = (crossingbot ? Crossingbot.Read_All_Bugs).mapTo[List[Bug]]
					complete(AllBugsFuture)
				} ~
				path("allFishes"){
					val AllFishesFuture = (crossingbot ? Crossingbot.Read_All_Fishes).mapTo[List[Fish]]
					complete(AllFishesFuture)
				}
			}
		}

		Http().bindAndHandle(toExpressRoutes, "localhost", 4774)
}
