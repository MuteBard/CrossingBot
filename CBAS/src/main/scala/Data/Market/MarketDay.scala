package Data.Market
import Data.Market.MarketHourBlock.HourBlock
import Data.Market.MarketQuarterBlock.QuarterBlock

import scala.util.Random

object MarketDay {

	case class Day(hourBlocks : List[HourBlock] = null){
		def generate() : Day = {
			val hour = HourBlock()
			val random = new Random
			val hourBlocks = (0 to 23).map(hourBlockId => {
				val value = random.nextInt(7) + 1
				value match {
					case 1 => hour.sleepy(hourBlockId)
					case 2 => hour.normal(hourBlockId)
					case 3 => hour.good(hourBlockId)
					case 4 => hour.good(hourBlockId)
					case 5 => hour.bad(hourBlockId)
					case 6 => hour.random(hourBlockId)
					case 7 => hour.risky(hourBlockId)
				}
			}).toList
			Day(hourBlocks)
		}

		def getHourBlock(index : Int): HourBlock = {
			hourBlocks(index)
		}

		def getQuarterBlock(indexH : Int, indexQ : Int) : QuarterBlock = {
			hourBlocks(indexH).quarterBlocks(indexQ)
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
			val trueIndexQ = (indexH * 4 + indexQ) + 1
			getHourBlockHistory(trueIndexH).flatMap(hour => hour.quarterBlocks).slice(0, trueIndexQ)
		}
	}
}
