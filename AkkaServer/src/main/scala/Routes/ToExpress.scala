package Routes
import Model.Bug_._
import Model.Fish_._
import Logic.Main._
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.server.Directives._
import akka.pattern.ask
import akka.util.Timeout
import scala.concurrent.duration._

object ToExpress extends BugJsonProtocol with FishJsonProtocol with SprayJsonSupport {
	implicit val timeout = Timeout(2 seconds)
	val toExpressRoutes =
		pathPrefix("api"){
			get{
				path("allBugs") {
						val AllBugsFuture = (crossingbot ? Crossingbot.Get_All_Bugs).mapTo[List[Bug]]
						complete(AllBugsFuture)
				}
			}
		}

	Http().bindAndHandle(toExpressRoutes, "localhost", 4774)
}
