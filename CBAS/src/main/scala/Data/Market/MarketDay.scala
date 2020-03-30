package Data.Market
import Data.Market.MarketQuarterBlock.{QuarterBlock, QuarterBlockJsonProtocol}
import Helper.Auxiliary.date
import scala.util.Random

object MarketDay {
	import Data.Market.MarketHourBlock.{HourBlock, HourJsonProtocolQuarter}
	import spray.json.DefaultJsonProtocol

	trait DayJsonProtocolQuarter extends DefaultJsonProtocol with HourJsonProtocolQuarter with QuarterBlockJsonProtocol{
		implicit val DayJson = jsonFormat4(Day)
	}

	case class Day(hourBlocks : List[HourBlock] = null, quarterBlockChanges: List[Int] = null, net : Int = 0, timestamp : String = ""){
		def generate() : Day = {
			val hour = HourBlock()
			val random = new Random
			val hourBlocks = (0 to 23).map(hourBlockId => {
				val value = random.nextInt(6) + 1
				value match {
					case 1 => hour.sleepy(hourBlockId)
					case 2 => hour.normal(hourBlockId)
					case 3 => hour.good(hourBlockId)
					case 4 => hour.bad(hourBlockId)
					case 5 => hour.random(hourBlockId)
					case 6 => hour.risky(hourBlockId)
				}
			}).toList
			val quarterBlocks = hourBlocks.flatMap(hourBlock => hourBlock.quarterBlocks.map(quarterBlock => quarterBlock.change))
			val net = quarterBlocks.sum
			val timestamp = date()
			Day(hourBlocks, quarterBlocks, net, timestamp)
		}

		def getHourBlock(index : Int): HourBlock = {
			hourBlocks(index)
		}

		def getQuarterBlock(indexH : Int, indexQ : Int) : QuarterBlock = {
			hourBlocks(indexH).quarterBlocks(indexQ)
		}

		def getMin2DBy(indexH : Int, indexQ : Int): Int = {
			val index = indexH * 2 + indexQ
			val quarterBlocksBeforeIndex = quarterBlockChanges.slice(0, index + 1)
			quarterBlocksBeforeIndex.reduce(math.min)
		}

		def getMax2DBy(indexH : Int, indexQ : Int) : Int = {
			val index = indexH * 2 + indexQ
			val quarterBlocksBeforeIndex = quarterBlockChanges.slice(0, index + 1)
			quarterBlocksBeforeIndex.reduce(math.max)
		}

		def getHourBlockHistory(index : Int) : List[HourBlock] = {
			hourBlocks.slice(0, index + 1)
		}

		//(0,0) represents List(x)
		//(0,1) represents List(x,x)
		//(0,2) represents List(x,x,x)
		//(0,3) represents List(x,x,x,x)
		//(1,0) represents List(x,x,x,x,x)
		//(23,3) is max with List().length == 96

		def getQuarterBlockHistory(indexH : Int, indexQ : Int) : List[QuarterBlock] = {
			val trueIndexH = indexH + 1
			println(trueIndexH)
			val trueIndexQ = (indexH * 4 + indexQ) + 1
			println(trueIndexQ)
			getHourBlockHistory(trueIndexH).flatMap(hour => hour.quarterBlocks).slice(0, trueIndexQ)
		}
	}
}
