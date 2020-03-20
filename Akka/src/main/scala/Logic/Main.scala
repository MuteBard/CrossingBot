package Logic

import Routes.ToExpress
import akka.actor.ActorSystem

object Main extends App{
	implicit val system = ActorSystem("CBAS")
	ToExpress
}