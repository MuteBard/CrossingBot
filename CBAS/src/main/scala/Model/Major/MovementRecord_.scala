package Model.Major
import Data.Market.MarketHourBlock.{HourBlock, HourBlockJsonProtocol}
import Data.Market.MarketQuarterBlock.{QuarterBlock, QuarterBlockJsonProtocol}

object MovementRecord_ {
	import spray.json.DefaultJsonProtocol
	case class MovementRecord(
		                         _id : String = "",
		                         hourBlockId : Int = 0,
		                         quarterBlockId : Int = 0,
		                         todayHigh: Int = 1000,
		                         todayLow : Int = 1000,
		                         hourBlockName : String = "",
		                         latestHourBlock : HourBlock = null,
		                         latestQuarterBlock : QuarterBlock = null,
		                         quarterBlockHistory : List[QuarterBlock] = List(),
		                         latestTurnipPrice : Int = 1000,
		                         turnipPriceHistory : List[Int] = List(1000),
		                         month : Int = 0,
		                         day : Int = 0,
							)

	trait MovementRecordJsonProtocol extends DefaultJsonProtocol with HourBlockJsonProtocol with QuarterBlockJsonProtocol{
		implicit val StalkJson = jsonFormat13(MovementRecord)
	}
}
