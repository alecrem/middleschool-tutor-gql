import { describe, test, expect } from 'vitest'
import { parseDeckList } from './deck-parser'

describe('parseDeckList', () => {
  test('should parse basic deck list with quantities', () => {
    const deckList = `4 Lightning Bolt
2 Counterspell
1 Black Lotus`
    
    const result = parseDeckList(deckList)
    
    expect(result).toEqual([
      { quantity: 4, name: 'Lightning Bolt' },
      { quantity: 2, name: 'Counterspell' },
      { quantity: 1, name: 'Black Lotus' }
    ])
  })

  test('should handle empty lines and whitespace', () => {
    const deckList = `4 Lightning Bolt

2 Counterspell
   
1 Black Lotus   `
    
    const result = parseDeckList(deckList)
    
    expect(result).toEqual([
      { quantity: 4, name: 'Lightning Bolt' },
      { quantity: 2, name: 'Counterspell' },
      { quantity: 1, name: 'Black Lotus' }
    ])
  })
})

describe('parseDeckLine', () => {
  // Import the internal function for more detailed testing
  // Note: This would need to be exported from deck-parser.ts for testing
  // For now, we'll test through parseDeckList
  
  test('should parse split cards with spaces', () => {
    const result = parseDeckList('4 Fire // Ice')
    expect(result).toEqual([{ quantity: 4, name: 'Fire // Ice' }])
  })
  
  test('should parse split cards without spaces around slashes', () => {
    const result = parseDeckList('4 Fire//Ice')
    expect(result).toEqual([{ quantity: 4, name: 'Fire//Ice' }])
  })
  
  test('should parse split cards with single slash and spaces', () => {
    const result = parseDeckList('1 Fire / Ice')
    expect(result).toEqual([{ quantity: 1, name: 'Fire / Ice' }])
  })
  
  test('should parse split cards with single slash no spaces', () => {
    const result = parseDeckList('1 Fire/Ice')
    expect(result).toEqual([{ quantity: 1, name: 'Fire/Ice' }])
  })
  
  test('should handle comments after regular cards', () => {
    const result = parseDeckList('2 Lightning Bolt // comment here')
    expect(result).toEqual([{ quantity: 2, name: 'Lightning Bolt' }])
  })
  
  test('should handle comments after split cards', () => {
    const result = parseDeckList('1 Fire // Ice // this is a comment')
    expect(result).toEqual([{ quantity: 1, name: 'Fire // Ice' }])
  })

  test('should handle card names with just quantity', () => {
    const result = parseDeckList('Fire // Ice')
    expect(result).toEqual([{ quantity: 1, name: 'Fire // Ice' }])
  })

  test('should handle different quantity formats', () => {
    const deckList = `4x Lightning Bolt
2 Counterspell
Counterspell x3
Black Lotus 1`
    
    const result = parseDeckList(deckList)
    
    expect(result).toEqual([
      { quantity: 4, name: 'Lightning Bolt' },
      { quantity: 2, name: 'Counterspell' },
      { quantity: 3, name: 'Counterspell' },
      { quantity: 1, name: 'Black Lotus' }
    ])
  })

  test('should handle complex split card names', () => {
    const deckList = `1 Life // Death
2 Assault // Battery
1 Night // Day`
    
    const result = parseDeckList(deckList)
    
    expect(result).toEqual([
      { quantity: 1, name: 'Life // Death' },
      { quantity: 2, name: 'Assault // Battery' },
      { quantity: 1, name: 'Night // Day' }
    ])
  })

  test('should ignore lines that are only comments', () => {
    const deckList = `4 Lightning Bolt
// This is a comment line
2 Counterspell`
    
    const result = parseDeckList(deckList)
    
    expect(result).toEqual([
      { quantity: 4, name: 'Lightning Bolt' },
      { quantity: 2, name: 'Counterspell' }
    ])
  })
})