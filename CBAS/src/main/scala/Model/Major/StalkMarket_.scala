package Model.Major

object StalkMarket_ {
	import spray.json.DefaultJsonProtocol
	case class StalkMarket(

		 _id : Int,
		 turnipBellPrices : Int,
		 todayHigh: Int,
		 todayLow : Int,
		 patternInPlay : List[String],
		 time : String,
		 day : String

	)

	trait StalkMarketJsonProtocol extends DefaultJsonProtocol{
		implicit val StalkMarketJson = jsonFormat7(StalkMarket)
	}
}
