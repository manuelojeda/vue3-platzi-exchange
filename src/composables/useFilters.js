import numeral from 'numeral'

const useFilters = () => {
  const dollarFilter = (value) => {
    if (!value) {
      return '$ 0'
    }

    return numeral(value).format('($ 0.00a)')
  }

  const percentFilter = (value) => {
    if (!value) {
      return '0%'
    }

    return `${Number(value).toFixed(2)}%`
  }

  return {
    dollarFilter,
    percentFilter
  }
}

export default useFilters
