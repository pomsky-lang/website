---
title: 'Unicode properties'
description: 'Exhaustive list of Unicode general categories, scripts, blocks and other properties supported by Pomsky'
excerpt: ''
date: 2022-05-17T13:55:00+00:00
lastmod: 2023-03-16T13:55:00+00:00
draft: false
images: []
menu:
  docs:
    parent: 'appendix'
weight: 10003
toc: true
---

Pomsky supports the following kinds of Unicode properties:

- General categories
- Scripts
- Blocks
- Other boolean properties

However, not all regex engines support all of them. In particular, _blocks_ and _other properties_
are poorly supported.

## Categories

Every Unicode code point is in one of the following _General Categories_:

- `Letter`
- `Mark`
- `Number`
- `Punctuation`
- `Symbol`
- `Separator`
- `Other`

Each of these categories is subdivided into smaller categories. More information on [Wikipedia](https://en.wikipedia.org/wiki/Unicode_character_property#General_Category).

In Pomsky, you can match against categories in square brackets:

```pomsky
[Uppercase_Letter Mark]
```

Using the abbreviations, the above can be written as

```pomsky
[Lu M]
```

<details>
<summary><b>Show all 38 categories</b></summary>

| Abbr | Long                    | Description                                          |
| ---- | ----------------------- | ---------------------------------------------------- |
| `Lu` | `Uppercase_Letter`      | an uppercase letter                                  |
| `Ll` | `Lowercase_Letter`      | a lowercase letter                                   |
| `Lt` | `Titlecase_Letter`      | a digraphic character, with first part uppercase     |
| `LC` | `Cased_Letter`          | `Lu` \| `Ll` \| `Lt`                                 |
| `Lm` | `Modifier_Letter`       | a modifier letter                                    |
| `Lo` | `Other_Letter`          | other letters, including syllables and ideographs    |
| `L`  | `Letter`                | `Lu` \| `Ll` \| `Lt` \| `Lm` \| `Lo`                 |
| `Mn` | `Nonspacing_Mark`       | a nonspacing combining mark (zero advance width)     |
| `Mc` | `Spacing_Mark`          | a spacing combining mark (positive advance width)    |
| `Me` | `Enclosing_Mark`        | an enclosing combining mark                          |
| `M`  | `Mark`                  | `Mn` \| `Mc` \| `Me`                                 |
| `Nd` | `Decimal_Number`        | a decimal digit                                      |
| `Nl` | `Letter_Number`         | a letterlike numeric character                       |
| `No` | `Other_Number`          | a numeric character of other type                    |
| `N`  | `Number`                | `Nd` \| `Nl` \| `No`                                 |
| `Pc` | `Connector_Punctuation` | a connecting punctuation mark, like a tie            |
| `Pd` | `Dash_Punctuation`      | a dash or hyphen punctuation mark                    |
| `Ps` | `Open_Punctuation`      | an opening punctuation mark (of a pair)              |
| `Pe` | `Close_Punctuation`     | a closing punctuation mark (of a pair)               |
| `Pi` | `Initial_Punctuation`   | an initial quotation mark                            |
| `Pf` | `Final_Punctuation`     | a final quotation mark                               |
| `Po` | `Other_Punctuation`     | a punctuation mark of other type                     |
| `P`  | `Punctuation`           | `Pc` \| `Pd` \| `Ps` \| `Pe` \| `Pi` \| `Pf` \| `Po` |
| `Sm` | `Math_Symbol`           | a symbol of mathematical use                         |
| `Sc` | `Currency_Symbol`       | a currency sign                                      |
| `Sk` | `Modifier_Symbol`       | a non-letterlike modifier symbol                     |
| `So` | `Other_Symbol`          | a symbol of other type                               |
| `S`  | `Symbol`                | `Sm` \| `Sc` \| `Sk` \| `So`                         |
| `Zs` | `Space_Separator`       | a space character (of various non-zero widths)       |
| `Zl` | `Line_Separator`        | U+2028 LINE SEPARATOR only                           |
| `Zp` | `Paragraph_Separator`   | U+2029 PARAGRAPH SEPARATOR only                      |
| `Z`  | `Separator`             | `Zs` \| `Zl` \| `Zp`                                 |
| `Cc` | `Control`               | a C0 or C1 control code                              |
| `Cf` | `Format`                | a format control character                           |
| `Cs` | `Surrogate`             | a surrogate code point<br />⚠️ not supported in Rust |
| `Co` | `Private_Use`           | a private-use character                              |
| `Cn` | `Unassigned`            | a reserved unassigned code point or a noncharacter   |
| `C`  | `Other`                 | `Cc` \| `Cf` \| `Cs` \| `Co` \| `Cn`                 |

</details>

### Support

| PCRE | JavaScript | Java | Ruby | Rust | .NET | Python |
| :--: | :--------: | :--: | :--: | :--: | :--: | :----: |
|  ✅  |     ✅     |  ✅  |  ✅  |  ✅  |  ✅  |   ⛔   |

Rust does not support the `Surrogate` category, because it is always Unicode aware and UTF-16 surrogates are not valid Unicode scalar values.

## Scripts

A script is a collection of code points used to represent textual information in one or more writing systems.

As with categories, code points can only be assigned to a single script. Code points used in multiple scripts are therefore assigned to the special script `Common`. More information on [Wikipedia](<https://en.wikipedia.org/wiki/Script_(Unicode)>).

<details>
<summary><b>Show all 164 scripts</b></summary>

| Abbr   | Long / Notes                                                |
| ------ | ----------------------------------------------------------- |
| `Adlm` | `Adlam`                                                     |
| `Aghb` | `Caucasian_Albanian`                                        |
| `Ahom` | `Ahom`                                                      |
| `Arab` | `Arabic`                                                    |
| `Armi` | `Imperial_Aramaic`                                          |
| `Armn` | `Armenian`                                                  |
| `Avst` | `Avestan`                                                   |
| `Bali` | `Balinese`                                                  |
| `Bamu` | `Bamum`                                                     |
| `Bass` | `Bassa_Vah`                                                 |
| `Batk` | `Batak`                                                     |
| `Beng` | `Bengali`                                                   |
| `Bhks` | `Bhaiksuki`                                                 |
| `Bopo` | `Bopomofo`                                                  |
| `Brah` | `Brahmi`                                                    |
| `Brai` | `Braille`                                                   |
| `Bugi` | `Buginese`                                                  |
| `Buhd` | `Buhid`                                                     |
| `Cakm` | `Chakma`                                                    |
| `Cans` | `Canadian_Aboriginal`                                       |
| `Cari` | `Carian`                                                    |
| `Cham` | `Cham`                                                      |
| `Cher` | `Cherokee`                                                  |
| `Chrs` | `Chorasmian`                                                |
| `Copt` | `Coptic`, `Qaac`                                            |
| `Cpmn` | `Cypro_Minoan`                                              |
| `Cprt` | `Cypriot`                                                   |
| `Cyrl` | `Cyrillic`                                                  |
| `Deva` | `Devanagari`                                                |
| `Diak` | `Dives_Akuru`                                               |
| `Dogr` | `Dogra`                                                     |
| `Dsrt` | `Deseret`                                                   |
| `Dupl` | `Duployan`                                                  |
| `Egyp` | `Egyptian_Hieroglyphs`                                      |
| `Elba` | `Elbasan`                                                   |
| `Elym` | `Elymaic`                                                   |
| `Ethi` | `Ethiopic`                                                  |
| `Geor` | `Georgian`                                                  |
| `Glag` | `Glagolitic`                                                |
| `Gong` | `Gunjala_Gondi`                                             |
| `Gonm` | `Masaram_Gondi`                                             |
| `Goth` | `Gothic`                                                    |
| `Gran` | `Grantha`                                                   |
| `Grek` | `Greek`                                                     |
| `Gujr` | `Gujarati`                                                  |
| `Guru` | `Gurmukhi`                                                  |
| `Hang` | `Hangul`                                                    |
| `Hani` | `Han`                                                       |
| `Hano` | `Hanunoo`                                                   |
| `Hatr` | `Hatran`                                                    |
| `Hebr` | `Hebrew`                                                    |
| `Hira` | `Hiragana`                                                  |
| `Hluw` | `Anatolian_Hieroglyphs`                                     |
| `Hmng` | `Pahawh_Hmong`                                              |
| `Hmnp` | `Nyiakeng_Puachue_Hmong`                                    |
| `Hung` | `Old_Hungarian`                                             |
| `Ital` | `Old_Italic`                                                |
| `Java` | `Javanese`                                                  |
| `Kali` | `Kayah_Li`                                                  |
| `Kana` | `Katakana`                                                  |
| `Kawi` | `Kawi`<br />⚠️ not supported by PCRE, Java and Ruby         |
| `Khar` | `Kharoshthi`                                                |
| `Khmr` | `Khmer`                                                     |
| `Khoj` | `Khojki`                                                    |
| `Kits` | `Khitan_Small_Script`                                       |
| `Knda` | `Kannada`                                                   |
| `Kthi` | `Kaithi`                                                    |
| `Lana` | `Tai_Tham`                                                  |
| `Laoo` | `Lao`                                                       |
| `Latn` | `Latin`                                                     |
| `Lepc` | `Lepcha`                                                    |
| `Limb` | `Limbu`                                                     |
| `Lina` | `Linear_A`                                                  |
| `Linb` | `Linear_B`                                                  |
| `Lisu` | `Lisu`                                                      |
| `Lyci` | `Lycian`                                                    |
| `Lydi` | `Lydian`                                                    |
| `Mahj` | `Mahajani`                                                  |
| `Maka` | `Makasar`                                                   |
| `Mand` | `Mandaic`                                                   |
| `Mani` | `Manichaean`                                                |
| `Marc` | `Marchen`                                                   |
| `Medf` | `Medefaidrin`                                               |
| `Mend` | `Mende_Kikakui`                                             |
| `Merc` | `Meroitic_Cursive`                                          |
| `Mero` | `Meroitic_Hieroglyphs`                                      |
| `Mlym` | `Malayalam`                                                 |
| `Modi` | `Modi`                                                      |
| `Mong` | `Mongolian`                                                 |
| `Mroo` | `Mro`                                                       |
| `Mtei` | `Meetei_Mayek`                                              |
| `Mult` | `Multani`                                                   |
| `Mymr` | `Myanmar`                                                   |
| `Nagm` | `Nag_Mundari`<br /> ⚠️ not supported by PCRE, Java and Ruby |
| `Nand` | `Nandinagari`                                               |
| `Narb` | `Old_North_Arabian`                                         |
| `Nbat` | `Nabataean`                                                 |
| `Newa` | `Newa`                                                      |
| `Nkoo` | `Nko`                                                       |
| `Nshu` | `Nushu`                                                     |
| `Ogam` | `Ogham`                                                     |
| `Olck` | `Ol_Chiki`                                                  |
| `Orkh` | `Old_Turkic`                                                |
| `Orya` | `Oriya`                                                     |
| `Osge` | `Osage`                                                     |
| `Osma` | `Osmanya`                                                   |
| `Ougr` | `Old_Uyghur`                                                |
| `Palm` | `Palmyrene`                                                 |
| `Pauc` | `Pau_Cin_Hau`                                               |
| `Perm` | `Old_Permic`                                                |
| `Phag` | `Phags_Pa`                                                  |
| `Phli` | `Inscriptional_Pahlavi`                                     |
| `Phlp` | `Psalter_Pahlavi`                                           |
| `Phnx` | `Phoenician`                                                |
| `Plrd` | `Miao`                                                      |
| `Prti` | `Inscriptional_Parthian`                                    |
| `Rjng` | `Rejang`                                                    |
| `Rohg` | `Hanifi_Rohingya`                                           |
| `Runr` | `Runic`                                                     |
| `Samr` | `Samaritan`                                                 |
| `Sarb` | `Old_South_Arabian`                                         |
| `Saur` | `Saurashtra`                                                |
| `Sgnw` | `SignWriting`                                               |
| `Shaw` | `Shavian`                                                   |
| `Shrd` | `Sharada`                                                   |
| `Sidd` | `Siddham`                                                   |
| `Sind` | `Khudawadi`                                                 |
| `Sinh` | `Sinhala`                                                   |
| `Sogd` | `Sogdian`                                                   |
| `Sogo` | `Old_Sogdian`                                               |
| `Sora` | `Sora_Sompeng`                                              |
| `Soyo` | `Soyombo`                                                   |
| `Sund` | `Sundanese`                                                 |
| `Sylo` | `Syloti_Nagri`                                              |
| `Syrc` | `Syriac`                                                    |
| `Tagb` | `Tagbanwa`                                                  |
| `Takr` | `Takri`                                                     |
| `Tale` | `Tai_Le`                                                    |
| `Talu` | `New_Tai_Lue`                                               |
| `Taml` | `Tamil`                                                     |
| `Tang` | `Tangut`                                                    |
| `Tavt` | `Tai_Viet`                                                  |
| `Telu` | `Telugu`                                                    |
| `Tfng` | `Tifinagh`                                                  |
| `Tglg` | `Tagalog`                                                   |
| `Thaa` | `Thaana`                                                    |
| `Thai` | `Thai`                                                      |
| `Tibt` | `Tibetan`                                                   |
| `Tirh` | `Tirhuta`                                                   |
| `Tnsa` | `Tangsa`                                                    |
| `Toto` | `Toto`                                                      |
| `Ugar` | `Ugaritic`                                                  |
| `Vaii` | `Vai`                                                       |
| `Vith` | `Vithkuqi`                                                  |
| `Wara` | `Warang_Citi`                                               |
| `Wcho` | `Wancho`                                                    |
| `Xpeo` | `Old_Persian`                                               |
| `Xsux` | `Cuneiform`                                                 |
| `Yezi` | `Yezidi`                                                    |
| `Yiii` | `Yi`                                                        |
| `Zanb` | `Zanabazar_Square`                                          |
| `Zinh` | `Inherited`                                                 |
| `Zyyy` | `Common`                                                    |
| `Zzzz` | `Unknown`<br /> ⚠️ not supported by Rust                    |

</details>

### Support

| PCRE | JavaScript | Java | Ruby | Rust | .NET | Python |
| :--: | :--------: | :--: | :--: | :--: | :--: | :----: |
|  ✅  |     ✅     |  ✅  |  ✅  |  ✅  |  ✅  |   ⛔   |

`Kawi` and `Nag_Mundari`, added in Unicode 15.0, are not yet supported in PCRE, Java and Ruby.

`Zzzz` (`Unknown`) is not supported in Rust.

JavaScript supports all scripts as of Unicode 15.0.

## Blocks

The Unicode character set is divided into blocks of consecutive code points that usually belong to the same script or serve a similar purpose.

There are often multiple blocks for a script. For example, there are 10 designated blocks for Latin code points: `Basic_Latin`, `Latin_1_Supplement`, `Latin_Extended_Additional`, and `Latin_Extended_A` through `Latin_Extended_G`. Furthermore, many blocks contain two or more scripts, which is not always clear from the name. For example, `Latin_Extended_E` includes a Greek code point.

It is almost always better to use the script rather than the block, but Pomsky still supports blocks using the `In` prefix:

```pomsky
# matches code points in the `Basic_Latin` block
[InBasic_Latin]
```

<details>
<summary><b>Show all 328 blocks</b></summary>

| Names                                                                                                |
| ---------------------------------------------------------------------------------------------------- |
| `Adlam`                                                                                              |
| `Aegean_Numbers`                                                                                     |
| `Ahom`                                                                                               |
| `Alchemical`, `Alchemical_Symbols`                                                                   |
| `Alphabetic_PF`, `Alphabetic_Presentation_Forms`                                                     |
| `Anatolian_Hieroglyphs`                                                                              |
| `Ancient_Greek_Music`, `Ancient_Greek_Musical_Notation`                                              |
| `Ancient_Greek_Numbers`                                                                              |
| `Ancient_Symbols`                                                                                    |
| `Arabic`                                                                                             |
| `Arabic_Ext_A`, `Arabic_Extended_A`                                                                  |
| `Arabic_Ext_B`, `Arabic_Extended_B`                                                                  |
| `Arabic_Ext_C`, `Arabic_Extended_C`                                                                  |
| `Arabic_Math`, `Arabic_Mathematical_Alphabetic_Symbols`                                              |
| `Arabic_PF_A`, `Arabic_Presentation_Forms_A`                                                         |
| `Arabic_PF_B`, `Arabic_Presentation_Forms_B`                                                         |
| `Arabic_Sup`, `Arabic_Supplement`                                                                    |
| `Armenian`                                                                                           |
| `Arrows`                                                                                             |
| `ASCII`, `Basic_Latin`                                                                               |
| `Avestan`                                                                                            |
| `Balinese`                                                                                           |
| `Bamum`                                                                                              |
| `Bamum_Sup`, `Bamum_Supplement`                                                                      |
| `Bassa_Vah`                                                                                          |
| `Batak`                                                                                              |
| `Bengali`                                                                                            |
| `Bhaiksuki`                                                                                          |
| `Block_Elements`                                                                                     |
| `Bopomofo`                                                                                           |
| `Bopomofo_Ext`, `Bopomofo_Extended`                                                                  |
| `Box_Drawing`                                                                                        |
| `Brahmi`                                                                                             |
| `Braille`, `Braille_Patterns`                                                                        |
| `Buginese`                                                                                           |
| `Buhid`                                                                                              |
| `Byzantine_Music`, `Byzantine_Musical_Symbols`                                                       |
| `Carian`                                                                                             |
| `Caucasian_Albanian`                                                                                 |
| `Chakma`                                                                                             |
| `Cham`                                                                                               |
| `Cherokee`                                                                                           |
| `Cherokee_Sup`, `Cherokee_Supplement`                                                                |
| `Chess_Symbols`                                                                                      |
| `Chorasmian`                                                                                         |
| `CJK`, `CJK_Unified_Ideographs`                                                                      |
| `CJK_Compat`, `CJK_Compatibility`                                                                    |
| `CJK_Compat_Forms`, `CJK_Compatibility_Forms`                                                        |
| `CJK_Compat_Ideographs`, `CJK_Compatibility_Ideographs`                                              |
| `CJK_Compat_Ideographs_Sup`, `CJK_Compatibility_Ideographs_Supplement`                               |
| `CJK_Ext_A`, `CJK_Unified_Ideographs_Extension_A`                                                    |
| `CJK_Ext_B`, `CJK_Unified_Ideographs_Extension_B`                                                    |
| `CJK_Ext_C`, `CJK_Unified_Ideographs_Extension_C`                                                    |
| `CJK_Ext_D`, `CJK_Unified_Ideographs_Extension_D`                                                    |
| `CJK_Ext_E`, `CJK_Unified_Ideographs_Extension_E`                                                    |
| `CJK_Ext_F`, `CJK_Unified_Ideographs_Extension_F`                                                    |
| `CJK_Ext_G`, `CJK_Unified_Ideographs_Extension_G`                                                    |
| `CJK_Ext_H`, `CJK_Unified_Ideographs_Extension_H`                                                    |
| `CJK_Radicals_Sup`, `CJK_Radicals_Supplement`                                                        |
| `CJK_Strokes`                                                                                        |
| `CJK_Symbols`, `CJK_Symbols_And_Punctuation`                                                         |
| `Compat_Jamo`, `Hangul_Compatibility_Jamo`                                                           |
| `Control_Pictures`                                                                                   |
| `Coptic`                                                                                             |
| `Coptic_Epact_Numbers`                                                                               |
| `Counting_Rod`, `Counting_Rod_Numerals`                                                              |
| `Cuneiform`                                                                                          |
| `Cuneiform_Numbers`, `Cuneiform_Numbers_And_Punctuation`                                             |
| `Currency_Symbols`                                                                                   |
| `Cypriot_Syllabary`                                                                                  |
| `Cypro_Minoan`                                                                                       |
| `Cyrillic`                                                                                           |
| `Cyrillic_Ext_A`, `Cyrillic_Extended_A`                                                              |
| `Cyrillic_Ext_B`, `Cyrillic_Extended_B`                                                              |
| `Cyrillic_Ext_C`, `Cyrillic_Extended_C`                                                              |
| `Cyrillic_Ext_D`, `Cyrillic_Extended_D`                                                              |
| `Cyrillic_Sup`, `Cyrillic_Supplement`, `Cyrillic_Supplementary`                                      |
| `Deseret`                                                                                            |
| `Devanagari`                                                                                         |
| `Devanagari_Ext`, `Devanagari_Extended`                                                              |
| `Devanagari_Ext_A`, `Devanagari_Extended_A`                                                          |
| `Diacriticals`, `Combining_Diacritical_Marks`                                                        |
| `Diacriticals_Ext`, `Combining_Diacritical_Marks_Extended`                                           |
| `Diacriticals_For_Symbols`, `Combining_Diacritical_Marks_For_Symbols`, `Combining_Marks_For_Symbols` |
| `Diacriticals_Sup`, `Combining_Diacritical_Marks_Supplement`                                         |
| `Dingbats`                                                                                           |
| `Dives_Akuru`                                                                                        |
| `Dogra`                                                                                              |
| `Domino`, `Domino_Tiles`                                                                             |
| `Duployan`                                                                                           |
| `Early_Dynastic_Cuneiform`                                                                           |
| `Egyptian_Hieroglyph_Format_Controls`                                                                |
| `Egyptian_Hieroglyphs`                                                                               |
| `Elbasan`                                                                                            |
| `Elymaic`                                                                                            |
| `Emoticons`                                                                                          |
| `Enclosed_Alphanum`, `Enclosed_Alphanumerics`                                                        |
| `Enclosed_Alphanum_Sup`, `Enclosed_Alphanumeric_Supplement`                                          |
| `Enclosed_CJK`, `Enclosed_CJK_Letters_And_Months`                                                    |
| `Enclosed_Ideographic_Sup`, `Enclosed_Ideographic_Supplement`                                        |
| `Ethiopic`                                                                                           |
| `Ethiopic_Ext`, `Ethiopic_Extended`                                                                  |
| `Ethiopic_Ext_A`, `Ethiopic_Extended_A`                                                              |
| `Ethiopic_Ext_B`, `Ethiopic_Extended_B`                                                              |
| `Ethiopic_Sup`, `Ethiopic_Supplement`                                                                |
| `Geometric_Shapes`                                                                                   |
| `Geometric_Shapes_Ext`, `Geometric_Shapes_Extended`                                                  |
| `Georgian`                                                                                           |
| `Georgian_Ext`, `Georgian_Extended`                                                                  |
| `Georgian_Sup`, `Georgian_Supplement`                                                                |
| `Glagolitic`                                                                                         |
| `Glagolitic_Sup`, `Glagolitic_Supplement`                                                            |
| `Gothic`                                                                                             |
| `Grantha`                                                                                            |
| `Greek`, `Greek_And_Coptic`                                                                          |
| `Greek_Ext`, `Greek_Extended`                                                                        |
| `Gujarati`                                                                                           |
| `Gunjala_Gondi`                                                                                      |
| `Gurmukhi`                                                                                           |
| `Half_And_Full_Forms`, `Halfwidth_And_Fullwidth_Forms`                                               |
| `Half_Marks`, `Combining_Half_Marks`                                                                 |
| `Hangul`, `Hangul_Syllables`                                                                         |
| `Hanifi_Rohingya`                                                                                    |
| `Hanunoo`                                                                                            |
| `Hatran`                                                                                             |
| `Hebrew`                                                                                             |
| `High_PU_Surrogates`, `High_Private_Use_Surrogates`                                                  |
| `High_Surrogates`                                                                                    |
| `Hiragana`                                                                                           |
| `IDC`, `Ideographic_Description_Characters`                                                          |
| `Ideographic_Symbols`, `Ideographic_Symbols_And_Punctuation`                                         |
| `Imperial_Aramaic`                                                                                   |
| `Indic_Number_Forms`, `Common_Indic_Number_Forms`                                                    |
| `Indic_Siyaq_Numbers`                                                                                |
| `Inscriptional_Pahlavi`                                                                              |
| `Inscriptional_Parthian`                                                                             |
| `IPA_Ext`, `IPA_Extensions`                                                                          |
| `Jamo`, `Hangul_Jamo`                                                                                |
| `Jamo_Ext_A`, `Hangul_Jamo_Extended_A`                                                               |
| `Jamo_Ext_B`, `Hangul_Jamo_Extended_B`                                                               |
| `Javanese`                                                                                           |
| `Kaithi`                                                                                             |
| `Kaktovik_Numerals`                                                                                  |
| `Kana_Ext_A`, `Kana_Extended_A`                                                                      |
| `Kana_Ext_B`, `Kana_Extended_B`                                                                      |
| `Kana_Sup`, `Kana_Supplement`                                                                        |
| `Kanbun`                                                                                             |
| `Kangxi`, `Kangxi_Radicals`                                                                          |
| `Kannada`                                                                                            |
| `Katakana`                                                                                           |
| `Katakana_Ext`, `Katakana_Phonetic_Extensions`                                                       |
| `Kawi`                                                                                               |
| `Kayah_Li`                                                                                           |
| `Kharoshthi`                                                                                         |
| `Khitan_Small_Script`                                                                                |
| `Khmer`                                                                                              |
| `Khmer_Symbols`                                                                                      |
| `Khojki`                                                                                             |
| `Khudawadi`                                                                                          |
| `Lao`                                                                                                |
| `Latin_1_Sup`, `Latin_1_Supplement` , `Latin_1`                                                      |
| `Latin_Ext_A`, `Latin_Extended_A`                                                                    |
| `Latin_Ext_Additional`, `Latin_Extended_Additional`                                                  |
| `Latin_Ext_B`, `Latin_Extended_B`                                                                    |
| `Latin_Ext_C`, `Latin_Extended_C`                                                                    |
| `Latin_Ext_D`, `Latin_Extended_D`                                                                    |
| `Latin_Ext_E`, `Latin_Extended_E`                                                                    |
| `Latin_Ext_F`, `Latin_Extended_F`                                                                    |
| `Latin_Ext_G`, `Latin_Extended_G`                                                                    |
| `Lepcha`                                                                                             |
| `Letterlike_Symbols`                                                                                 |
| `Limbu`                                                                                              |
| `Linear_A`                                                                                           |
| `Linear_B_Ideograms`                                                                                 |
| `Linear_B_Syllabary`                                                                                 |
| `Lisu`                                                                                               |
| `Lisu_Sup`, `Lisu_Supplement`                                                                        |
| `Low_Surrogates`                                                                                     |
| `Lycian`                                                                                             |
| `Lydian`                                                                                             |
| `Mahajani`                                                                                           |
| `Mahjong`, `Mahjong_Tiles`                                                                           |
| `Makasar`                                                                                            |
| `Malayalam`                                                                                          |
| `Mandaic`                                                                                            |
| `Manichaean`                                                                                         |
| `Marchen`                                                                                            |
| `Masaram_Gondi`                                                                                      |
| `Math_Alphanum`, `Mathematical_Alphanumeric_Symbols`                                                 |
| `Math_Operators`, `Mathematical_Operators`                                                           |
| `Mayan_Numerals`                                                                                     |
| `Medefaidrin`                                                                                        |
| `Meetei_Mayek`                                                                                       |
| `Meetei_Mayek_Ext`, `Meetei_Mayek_Extensions`                                                        |
| `Mende_Kikakui`                                                                                      |
| `Meroitic_Cursive`                                                                                   |
| `Meroitic_Hieroglyphs`                                                                               |
| `Miao`                                                                                               |
| `Misc_Arrows`, `Miscellaneous_Symbols_And_Arrows`                                                    |
| `Misc_Math_Symbols_A`, `Miscellaneous_Mathematical_Symbols_A`                                        |
| `Misc_Math_Symbols_B`, `Miscellaneous_Mathematical_Symbols_B`                                        |
| `Misc_Pictographs`, `Miscellaneous_Symbols_And_Pictographs`                                          |
| `Misc_Symbols`, `Miscellaneous_Symbols`                                                              |
| `Misc_Technical`, `Miscellaneous_Technical`                                                          |
| `Modi`                                                                                               |
| `Modifier_Letters`, `Spacing_Modifier_Letters`                                                       |
| `Modifier_Tone_Letters`                                                                              |
| `Mongolian`                                                                                          |
| `Mongolian_Sup`, `Mongolian_Supplement`                                                              |
| `Mro`                                                                                                |
| `Multani`                                                                                            |
| `Music`, `Musical_Symbols`                                                                           |
| `Myanmar`                                                                                            |
| `Myanmar_Ext_A`, `Myanmar_Extended_A`                                                                |
| `Myanmar_Ext_B`, `Myanmar_Extended_B`                                                                |
| `Nabataean`                                                                                          |
| `Nag_Mundari`                                                                                        |
| `Nandinagari`                                                                                        |
| `NB`, `No_Block`                                                                                     |
| `New_Tai_Lue`                                                                                        |
| `Newa`                                                                                               |
| `NKo`                                                                                                |
| `Number_Forms`                                                                                       |
| `Nushu`                                                                                              |
| `Nyiakeng_Puachue_Hmong`                                                                             |
| `OCR`, `Optical_Character_Recognition`                                                               |
| `Ogham`                                                                                              |
| `Ol_Chiki`                                                                                           |
| `Old_Hungarian`                                                                                      |
| `Old_Italic`                                                                                         |
| `Old_North_Arabian`                                                                                  |
| `Old_Permic`                                                                                         |
| `Old_Persian`                                                                                        |
| `Old_Sogdian`                                                                                        |
| `Old_South_Arabian`                                                                                  |
| `Old_Turkic`                                                                                         |
| `Old_Uyghur`                                                                                         |
| `Oriya`                                                                                              |
| `Ornamental_Dingbats`                                                                                |
| `Osage`                                                                                              |
| `Osmanya`                                                                                            |
| `Ottoman_Siyaq_Numbers`                                                                              |
| `Pahawh_Hmong`                                                                                       |
| `Palmyrene`                                                                                          |
| `Pau_Cin_Hau`                                                                                        |
| `Phags_Pa`                                                                                           |
| `Phaistos`, `Phaistos_Disc`                                                                          |
| `Phoenician`                                                                                         |
| `Phonetic_Ext`, `Phonetic_Extensions`                                                                |
| `Phonetic_Ext_Sup`, `Phonetic_Extensions_Supplement`                                                 |
| `Playing_Cards`                                                                                      |
| `Psalter_Pahlavi`                                                                                    |
| `PUA`, `Private_Use_Area`, `Private_Use`                                                             |
| `Punctuation`, `General_Punctuation`                                                                 |
| `Rejang`                                                                                             |
| `Rumi`, `Rumi_Numeral_Symbols`                                                                       |
| `Runic`                                                                                              |
| `Samaritan`                                                                                          |
| `Saurashtra`                                                                                         |
| `Sharada`                                                                                            |
| `Shavian`                                                                                            |
| `Shorthand_Format_Controls`                                                                          |
| `Siddham`                                                                                            |
| `Sinhala`                                                                                            |
| `Sinhala_Archaic_Numbers`                                                                            |
| `Small_Forms`, `Small_Form_Variants`                                                                 |
| `Small_Kana_Ext`, `Small_Kana_Extension`                                                             |
| `Sogdian`                                                                                            |
| `Sora_Sompeng`                                                                                       |
| `Soyombo`                                                                                            |
| `Specials`                                                                                           |
| `Sundanese`                                                                                          |
| `Sundanese_Sup`, `Sundanese_Supplement`                                                              |
| `Sup_Arrows_A`, `Supplemental_Arrows_A`                                                              |
| `Sup_Arrows_B`, `Supplemental_Arrows_B`                                                              |
| `Sup_Arrows_C`, `Supplemental_Arrows_C`                                                              |
| `Sup_Math_Operators`, `Supplemental_Mathematical_Operators`                                          |
| `Sup_PUA_A`, `Supplementary_Private_Use_Area_A`                                                      |
| `Sup_PUA_B`, `Supplementary_Private_Use_Area_B`                                                      |
| `Sup_Punctuation`, `Supplemental_Punctuation`                                                        |
| `Sup_Symbols_And_Pictographs`, `Supplemental_Symbols_And_Pictographs`                                |
| `Super_And_Sub`, `Superscripts_And_Subscripts`                                                       |
| `Sutton_SignWriting`                                                                                 |
| `Syloti_Nagri`                                                                                       |
| `Symbols_And_Pictographs_Ext_A`, `Symbols_And_Pictographs_Extended_A`                                |
| `Symbols_For_Legacy_Computing`                                                                       |
| `Syriac`                                                                                             |
| `Syriac_Sup`, `Syriac_Supplement`                                                                    |
| `Tagalog`                                                                                            |
| `Tagbanwa`                                                                                           |
| `Tags`                                                                                               |
| `Tai_Le`                                                                                             |
| `Tai_Tham`                                                                                           |
| `Tai_Viet`                                                                                           |
| `Tai_Xuan_Jing`, `Tai_Xuan_Jing_Symbols`                                                             |
| `Takri`                                                                                              |
| `Tamil`                                                                                              |
| `Tamil_Sup`, `Tamil_Supplement`                                                                      |
| `Tangsa`                                                                                             |
| `Tangut`                                                                                             |
| `Tangut_Components`                                                                                  |
| `Tangut_Sup`, `Tangut_Supplement`                                                                    |
| `Telugu`                                                                                             |
| `Thaana`                                                                                             |
| `Thai`                                                                                               |
| `Tibetan`                                                                                            |
| `Tifinagh`                                                                                           |
| `Tirhuta`                                                                                            |
| `Toto`                                                                                               |
| `Transport_And_Map`, `Transport_And_Map_Symbols`                                                     |
| `UCAS`, `Unified_Canadian_Aboriginal_Syllabics`, `Canadian_Syllabics`                                |
| `UCAS_Ext`, `Unified_Canadian_Aboriginal_Syllabics_Extended`                                         |
| `UCAS_Ext_A`, `Unified_Canadian_Aboriginal_Syllabics_Extended_A`                                     |
| `Ugaritic`                                                                                           |
| `Vai`                                                                                                |
| `Vedic_Ext`, `Vedic_Extensions`                                                                      |
| `Vertical_Forms`                                                                                     |
| `Vithkuqi`                                                                                           |
| `VS`, `Variation_Selectors`                                                                          |
| `VS_Sup`, `Variation_Selectors_Supplement`                                                           |
| `Wancho`                                                                                             |
| `Warang_Citi`                                                                                        |
| `Yezidi`                                                                                             |
| `Yi_Radicals`                                                                                        |
| `Yi_Syllables`                                                                                       |
| `Yijing`, `Yijing_Hexagram_Symbols`                                                                  |
| `Zanabazar_Square`                                                                                   |
| `Znamenny_Music`, `Znamenny_Musical_Notation`                                                        |

</details>

### Support

| PCRE | JavaScript | Java | Ruby | Rust | .NET | Python |
| :--: | :--------: | :--: | :--: | :--: | :--: | :----: |
|  ⛔  |     ⛔     |  ✅  |  ✅  |  ⛔  |  ✅  |   ⛔   |

Java doesn't support the block `No_Block`.

Ruby doesn't support the following blocks:

- `Arabic_Extended_C`
- `CJK_Unified_Ideographs_Extension_H`
- `Cyrillic_Extended_D`
- `Devanagari_Extended_A`
- `Kaktovik_Numerals`

## Other properties

There are a number of boolean properties (meaning they are either `Yes` or `No`), which you can use in Pomsky by simply putting them in square brackets:

```pomsky
# match code points with Diacritic=Yes
[Diacritic]
```

<details>
<summary><b>Show all 53 other properties</b></summary>

| Abbr       | Long                           |
| ---------- | ------------------------------ |
| `ASCII`    | `ASCII`                        |
| `AHex`     | `ASCII_Hex_Digit`              |
| `Alpha`    | `Alphabetic`                   |
| `Any`      | `Any`                          |
| `Assigned` | `Assigned`                     |
| `Bidi_C`   | `Bidi_Control`                 |
| `Bidi_M`   | `Bidi_Mirrored`                |
| `CI`       | `Case_Ignorable`               |
| `Cased`    | `Cased`                        |
| `CWCF`     | `Changes_When_Casefolded`      |
| `CWCM`     | `Changes_When_Casemapped`      |
| `CWL`      | `Changes_When_Lowercased`      |
| `CWKCF`    | `Changes_When_NFKC_Casefolded` |
| `CWT`      | `Changes_When_Titlecased`      |
| `CWU`      | `Changes_When_Uppercased`      |
| `Dash`     | `Dash`                         |
| `DI`       | `Default_Ignorable_Code_Point` |
| `Dep`      | `Deprecated`                   |
| `Dia`      | `Diacritic`                    |
| `Emoji`    | `Emoji`                        |
| `EComp`    | `Emoji_Component`              |
| `EMod`     | `Emoji_Modifier`               |
| `EBase`    | `Emoji_Modifier_Base`          |
| `EPres`    | `Emoji_Presentation`           |
| `ExtPict`  | `Extended_Pictographic`        |
| `Ext`      | `Extender`                     |
| `Gr_Base`  | `Grapheme_Base`                |
| `Gr_Ext`   | `Grapheme_Extend`              |
| `Hex`      | `Hex_Digit`                    |
| `IDSB`     | `IDS_Binary_Operator`          |
| `IDST`     | `IDS_Trinary_Operator`         |
| `IDC`      | `ID_Continue`                  |
| `IDS`      | `ID_Start`                     |
| `Ideo`     | `Ideographic`                  |
| `Join_C`   | `Join_Control`                 |
| `LOE`      | `Logical_Order_Exception`      |
| `Lower`    | `Lowercase`                    |
| `Math`     | `Math`                         |
| `NChar`    | `Noncharacter_Code_Point`      |
| `Pat_Syn`  | `Pattern_Syntax`               |
| `Pat_WS`   | `Pattern_White_Space`          |
| `QMark`    | `Quotation_Mark`               |
| `Radical`  | `Radical`                      |
| `RI`       | `Regional_Indicator`           |
| `STerm`    | `Sentence_Terminal`            |
| `SD`       | `Soft_Dotted`                  |
| `Term`     | `Terminal_Punctuation`         |
| `UIdeo`    | `Unified_Ideograph`            |
| `Upper`    | `Uppercase`                    |
| `VS`       | `Variation_Selector`           |
| `space`    | `White_Space`                  |
| `XIDC`     | `XID_Continue`                 |
| `XIDS`     | `XID_Start`                    |

</details>

### Support

| PCRE | JavaScript | Java | Ruby | Rust | .NET | Python |
| :--: | :--------: | :--: | :--: | :--: | :--: | :----: |
|  ✅  |     ✅     |  ⛔  |  ✅  |  ✅  |  ✅  |   ⛔   |

PCRE doesn't support the following blocks:

- `Assigned`
- `Changes_When_NFKC_Casefolded`

Ruby doesn't support the following blocks:

- `Bidi_Mirrored`
- `Changes_When_NFKC_Casefolded`

Rust doesn't support the following blocks:

- `Changes_When_NFKC_Casefolded`

JavaScript supports all boolean properties as of Unicode 15.0.
