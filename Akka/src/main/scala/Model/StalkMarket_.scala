package Model

object StalkMarket_ {
	import spray.json.DefaultJsonProtocol
	case class StalkMarket(
		 turnipBellPrices : Int,
		 todayHigh: Int,
		 todayLow : Int,
		 patternInPlay : List[String],
		 time : String,
		 day : String

	)

	trait StalkMarketJsonProtocol extends DefaultJsonProtocol{
		implicit val StalkMarketJson = jsonFormat6(StalkMarket)
	}
}

