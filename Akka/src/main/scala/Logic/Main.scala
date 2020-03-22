package Logic

import Routes.ToNodeJS
import akka.actor.ActorSystem

object Main extends App{
	implicit val system = ActorSystem("CBAS")
	ToNodeJS
}