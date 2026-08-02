export interface Unit {
  id: string
  name: string
  symbol: string
  factor?: number
  offset?: number
  toBase?: (v: number) => number
  fromBase?: (v: number) => number
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  units: Unit[]
}

interface UnitOverrides {
  toBase?: (v: number) => number
  fromBase?: (v: number) => number
}

const unit = (
  id: string,
  name: string,
  symbol: string,
  factor?: number,
  offset?: number,
  overrides?: UnitOverrides,
): Unit => ({ id, name, symbol, factor, offset, ...overrides })

export function toBaseValue(u: Unit, value: number): number {
  if (u.toBase) return u.toBase(value)
  return (value + (u.offset ?? 0)) * (u.factor ?? 1)
}

export function fromBaseValue(u: Unit, value: number): number {
  if (u.fromBase) return u.fromBase(value)
  return value / (u.factor ?? 1) - (u.offset ?? 0)
}

export function convert(value: number, from: Unit, to: Unit): number {
  return fromBaseValue(to, toBaseValue(from, value))
}

const PI = Math.PI

export const categories: Category[] = [
  {
    id: 'length',
    name: 'Length',
    description: 'Distance and dimension',
    icon: 'Ruler',
    units: [
      unit('m', 'Meter', 'm', 1),
      unit('km', 'Kilometer', 'km', 1000),
      unit('cm', 'Centimeter', 'cm', 0.01),
      unit('mm', 'Millimeter', 'mm', 0.001),
      unit('um', 'Micrometer', 'µm', 1e-6),
      unit('nm', 'Nanometer', 'nm', 1e-9),
      unit('mi', 'Mile', 'mi', 1609.344),
      unit('yd', 'Yard', 'yd', 0.9144),
      unit('ft', 'Foot', 'ft', 0.3048),
      unit('in', 'Inch', 'in', 0.0254),
      unit('nmi', 'Nautical mile', 'nmi', 1852),
      unit('ly', 'Light year', 'ly', 9.4607304725808e15),
      unit('au', 'Astronomical unit', 'au', 1.495978707e11),
    ],
  },
  {
    id: 'mass',
    name: 'Mass',
    description: 'Weight and mass',
    icon: 'Weight',
    units: [
      unit('g', 'Gram', 'g', 1),
      unit('kg', 'Kilogram', 'kg', 1000),
      unit('mg', 'Milligram', 'mg', 0.001),
      unit('ug', 'Microgram', 'µg', 1e-6),
      unit('t', 'Metric ton', 't', 1e6),
      unit('lb', 'Pound', 'lb', 453.59237),
      unit('oz', 'Ounce', 'oz', 28.349523125),
      unit('st', 'Stone', 'st', 6350.29318),
      unit('ct', 'Carat', 'ct', 0.2),
      unit('uston', 'US ton', 'us ton', 907184.74),
      unit('ukton', 'Imperial ton', 'uk ton', 1016046.9088),
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    description: 'Heat and cold',
    icon: 'Thermometer',
    units: [
      unit('c', 'Celsius', '°C', 1),
      unit('f', 'Fahrenheit', '°F', 5 / 9, -32),
      unit('k', 'Kelvin', 'K', 1, -273.15),
      unit('r', 'Rankine', '°R', 5 / 9, -491.67),
      unit('d', 'Delisle', '°De', -2 / 3, 150),
      unit('n', 'Newton', '°N', 100 / 33),
      unit('re', 'Réaumur', '°Ré', 5 / 4),
      unit('ro', 'Rømer', '°Rø', 40 / 21, -7.5),
    ],
  },
  {
    id: 'area',
    name: 'Area',
    description: 'Surface measurement',
    icon: 'Square',
    units: [
      unit('m2', 'Square meter', 'm²', 1),
      unit('km2', 'Square kilometer', 'km²', 1e6),
      unit('cm2', 'Square centimeter', 'cm²', 1e-4),
      unit('mm2', 'Square millimeter', 'mm²', 1e-6),
      unit('ha', 'Hectare', 'ha', 10000),
      unit('acre', 'Acre', 'ac', 4046.8564224),
      unit('mi2', 'Square mile', 'mi²', 2589988.110336),
      unit('yd2', 'Square yard', 'yd²', 0.83612736),
      unit('ft2', 'Square foot', 'ft²', 0.09290304),
      unit('in2', 'Square inch', 'in²', 0.00064516),
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    description: 'Capacity and space',
    icon: 'FlaskConical',
    units: [
      unit('l', 'Liter', 'L', 1),
      unit('ml', 'Milliliter', 'mL', 0.001),
      unit('m3', 'Cubic meter', 'm³', 1000),
      unit('cm3', 'Cubic centimeter', 'cm³', 0.001),
      unit('ft3', 'Cubic foot', 'ft³', 28.316846592),
      unit('in3', 'Cubic inch', 'in³', 0.016387064),
      unit('gal', 'US gallon', 'gal', 3.785411784),
      unit('qt', 'US quart', 'qt', 0.946352946),
      unit('pt', 'US pint', 'pt', 0.473176473),
      unit('cup', 'US cup', 'cup', 0.2365882365),
      unit('floz', 'US fluid ounce', 'fl oz', 0.0295735295625),
      unit('tbsp', 'Tablespoon', 'tbsp', 0.01478676478125),
      unit('tsp', 'Teaspoon', 'tsp', 0.00492892159375),
      unit('impgal', 'Imperial gallon', 'imp gal', 4.54609),
      unit('imppt', 'Imperial pint', 'imp pt', 0.56826125),
      unit('impfloz', 'Imperial fluid ounce', 'imp fl oz', 0.0284130625),
    ],
  },
  {
    id: 'time',
    name: 'Time',
    description: 'Duration and intervals',
    icon: 'Clock',
    units: [
      unit('s', 'Second', 's', 1),
      unit('ms', 'Millisecond', 'ms', 0.001),
      unit('us', 'Microsecond', 'µs', 1e-6),
      unit('ns', 'Nanosecond', 'ns', 1e-9),
      unit('min', 'Minute', 'min', 60),
      unit('h', 'Hour', 'h', 3600),
      unit('d', 'Day', 'd', 86400),
      unit('wk', 'Week', 'wk', 604800),
      unit('mo', 'Month (30 days)', 'mo', 2592000),
      unit('yr', 'Year (365 days)', 'yr', 31536000),
      unit('dec', 'Decade', 'decade', 315360000),
      unit('cen', 'Century', 'century', 3153600000),
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    description: 'Velocity and rate',
    icon: 'Gauge',
    units: [
      unit('mps', 'Meter per second', 'm/s', 1),
      unit('kmh', 'Kilometer per hour', 'km/h', 1 / 3.6),
      unit('mph', 'Mile per hour', 'mph', 0.44704),
      unit('fps', 'Foot per second', 'ft/s', 0.3048),
      unit('kn', 'Knot', 'kn', 1852 / 3600),
      unit('mach', 'Mach (sea level)', 'M', 340.29),
      unit('c', 'Speed of light', 'c', 299792458),
    ],
  },
  {
    id: 'data',
    name: 'Data',
    description: 'Digital storage',
    icon: 'HardDrive',
    units: [
      unit('bit', 'Bit', 'b', 0.125),
      unit('byte', 'Byte', 'B', 1),
      unit('kbit', 'Kilobit', 'kb', 125),
      unit('Mbit', 'Megabit', 'Mb', 125000),
      unit('Gbit', 'Gigabit', 'Gb', 125000000),
      unit('Tbit', 'Terabit', 'Tb', 125000000000),
      unit('kb', 'Kilobyte', 'KB', 1000),
      unit('mb', 'Megabyte', 'MB', 1e6),
      unit('gb', 'Gigabyte', 'GB', 1e9),
      unit('tb', 'Terabyte', 'TB', 1e12),
      unit('pb', 'Petabyte', 'PB', 1e15),
      unit('kib', 'Kibibyte', 'KiB', 1024),
      unit('mib', 'Mebibyte', 'MiB', 1048576),
      unit('gib', 'Gibibyte', 'GiB', 1073741824),
      unit('tib', 'Tebibyte', 'TiB', 1099511627776),
    ],
  },
  {
    id: 'energy',
    name: 'Energy',
    description: 'Work and heat',
    icon: 'Zap',
    units: [
      unit('j', 'Joule', 'J', 1),
      unit('kj', 'Kilojoule', 'kJ', 1000),
      unit('mj', 'Megajoule', 'MJ', 1e6),
      unit('cal', 'Calorie', 'cal', 4.184),
      unit('kcal', 'Kilocalorie', 'kcal', 4184),
      unit('wh', 'Watt-hour', 'Wh', 3600),
      unit('kwh', 'Kilowatt-hour', 'kWh', 3600000),
      unit('mwh', 'Megawatt-hour', 'MWh', 3.6e9),
      unit('ev', 'Electronvolt', 'eV', 1.602176634e-19),
      unit('btu', 'British thermal unit', 'BTU', 1055.05585262),
      unit('ftlb', 'Foot-pound', 'ft·lb', 1.3558179483),
      unit('therm', 'Therm', 'therm', 105505585.262),
    ],
  },
  {
    id: 'pressure',
    name: 'Pressure',
    description: 'Force per area',
    icon: 'Wind',
    units: [
      unit('pa', 'Pascal', 'Pa', 1),
      unit('kpa', 'Kilopascal', 'kPa', 1000),
      unit('mpa', 'Megapascal', 'MPa', 1e6),
      unit('bar', 'Bar', 'bar', 100000),
      unit('mbar', 'Millibar', 'mbar', 100),
      unit('atm', 'Atmosphere', 'atm', 101325),
      unit('torr', 'Torr', 'Torr', 133.322368421),
      unit('mmhg', 'Millimeter of mercury', 'mmHg', 133.322387415),
      unit('psi', 'Pound per square inch', 'psi', 6894.757293168),
      unit('inhg', 'Inch of mercury', 'inHg', 3386.389),
      unit('at', 'Technical atmosphere', 'at', 98066.5),
    ],
  },
  {
    id: 'angle',
    name: 'Angle',
    description: 'Geometric rotation',
    icon: 'Compass',
    units: [
      unit('rad', 'Radian', 'rad', 1),
      unit('deg', 'Degree', '°', PI / 180),
      unit('grad', 'Gradian', 'gon', PI / 200),
      unit('arcmin', 'Arcminute', '′', PI / 10800),
      unit('arcsec', 'Arcsecond', '″', PI / 648000),
      unit('turn', 'Revolution', 'turn', 2 * PI),
      unit('mil', 'Mil', 'mil', PI / 3200),
    ],
  },
  {
    id: 'frequency',
    name: 'Frequency',
    description: 'Cycles per second',
    icon: 'Activity',
    units: [
      unit('hz', 'Hertz', 'Hz', 1),
      unit('khz', 'Kilohertz', 'kHz', 1000),
      unit('mhz', 'Megahertz', 'MHz', 1e6),
      unit('ghz', 'Gigahertz', 'GHz', 1e9),
      unit('thz', 'Terahertz', 'THz', 1e12),
      unit('rpm', 'Revolution per minute', 'rpm', 1 / 60),
    ],
  },
  {
    id: 'data-rate',
    name: 'Data transfer',
    description: 'Transfer speed',
    icon: 'Wifi',
    units: [
      unit('bps', 'Bit per second', 'bps', 1),
      unit('Bps', 'Byte per second', 'B/s', 8),
      unit('kbps', 'Kilobit per second', 'kbps', 1000),
      unit('Mbps', 'Megabit per second', 'Mbps', 1e6),
      unit('Gbps', 'Gigabit per second', 'Gbps', 1e9),
      unit('kBs', 'Kilobyte per second', 'kB/s', 8000),
      unit('MBs', 'Megabyte per second', 'MB/s', 8e6),
      unit('GBs', 'Gigabyte per second', 'GB/s', 8e9),
    ],
  },
  {
    id: 'fuel',
    name: 'Fuel economy',
    description: 'Consumption and efficiency',
    icon: 'Fuel',
    units: [
      unit('lp100', 'Liters per 100 km', 'L/100km', undefined, undefined, {
        toBase: (v) => v,
        fromBase: (v) => v,
      }),
      unit('kpl', 'Kilometers per liter', 'km/L', undefined, undefined, {
        toBase: (v) => (v === 0 ? Infinity : 100 / v),
        fromBase: (v) => (v === 0 ? Infinity : 100 / v),
      }),
      unit('mpgus', 'Miles per gallon (US)', 'mpg', undefined, undefined, {
        toBase: (v) => (v === 0 ? Infinity : 235.214583 / v),
        fromBase: (v) => (v === 0 ? Infinity : 235.214583 / v),
      }),
      unit('mpguk', 'Miles per gallon (UK)', 'mpg', undefined, undefined, {
        toBase: (v) => (v === 0 ? Infinity : 282.480936 / v),
        fromBase: (v) => (v === 0 ? Infinity : 282.480936 / v),
      }),
    ],
  },
]

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}
