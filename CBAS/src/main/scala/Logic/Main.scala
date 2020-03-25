package Logic

import Routes.ToNodeJS
import akka.actor.ActorSystem

object Main extends App{
	implicit val system = ActorSystem("CBAS")
	println("CBAS booting up...")
	ToNodeJS
	println("CBAS listening at localhost:4774/api/")
}