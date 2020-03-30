package Model.Major

object Fish_ {
	import spray.json.DefaultJsonProtocol
	case class Fish(
		_id : Int = 0,
		fishId : String = "",
		name : String = "NULL/FISH",
		bells : Int = 0,
		availability : List[String] = List(),
		rarity : Int = 0,
		img : String = ""
    )

	trait FishJsonProtocol extends DefaultJsonProtocol{
		implicit val FishJson = jsonFormat7(Fish)
	}
}
