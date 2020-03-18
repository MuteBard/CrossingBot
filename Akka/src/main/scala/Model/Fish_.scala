package Model

object Fish_ {
	import spray.json.DefaultJsonProtocol
	case class Fish(
		_id : Int,
		fishId : String,
		name : String,
		bells : Int,
		availability : List[String],
		rarity : Int,
		img : String
    )

	trait FishJsonProtocol extends DefaultJsonProtocol{
		implicit val FishJson = jsonFormat7(Fish)
	}
}
