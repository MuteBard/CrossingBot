package Model.Inbound

import Model.OutBound.Fish_.Fish

object AddingFish_ {
	import spray.json.DefaultJsonProtocol
	case class AddingFish(
		username : String,
		fish : Fish
	)

	trait AddingFishJsonProtocol extends DefaultJsonProtocol{
		implicit val FishJson = jsonFormat7(Fish)
		implicit val AddingFishJson = jsonFormat2(AddingFish)
	}
}
