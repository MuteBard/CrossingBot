package Model

object User_ {
	import spray.json.DefaultJsonProtocol
	case class User(
		id : Int,
		username : String,
		fishingPoleLvl : Int,
		bugNetLvl : Int,
		userLvl : Int,
		bells : Int,
		turnips : Int,
		pocket : List[String],
		img : String,
	)

	trait UserjsonProtocol extends DefaultJsonProtocol{
		implicit val UserJson = jsonFormat9(User)
	}
}
