import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import type { ColumnsType } from 'antd/es/table'
import Table from '@/shared/components/table'

export const Route = createFileRoute('/(public)/demo/table')({
  component: RouteComponent,
})

type Num = number | string | null
export interface Data {
  category?: string
  branchCd?: number
  branchName?: string

  totalMonthlyCumulative?: Num
  generalMonthlyCumulative?: Num
  consignmentMonthlyCumulative?: Num
  leaseMonthlyCumulative?: Num

  live_chat_inq_count?: Num
  phone_inq_count?: Num

  purchasePrice?: Num
  stockValuationAmount?: Num
  stockValuationProfit?: Num

  avgProcessingPeriodStockCount?: Num
  count_avgProcessingPeriodStockCount?: Num

  avgAdPeriodStockCount?: Num
  count_avgAdPeriodStockCount?: Num

  avgViewsStockCount?: Num
  count_avgViewsStockCount?: Num

  avgCallsStockCount?: Num
  count_avgCallsStockCount?: Num

  normalCount?: Num
  interestedCount?: Num
  longTermCount?: Num

  processingStockCount?: Num
  adPreparingStockCount?: Num

  ad702StockCount?: Num
  adKrStockCount?: Num
  adEncarStockCount?: Num
  adOtherStockCount?: Num

  kassStProfitFinal?: Num

  previousLongTermCount?: Num
  previousAdPreparingStockCount?: Num
}

export interface BranchGroup {
  '지점 합계': Data
  [branchName: string]: Data
}

export interface Root {
  success: boolean
  data: {
    전체: Data
    [group: string]: Data | BranchGroup
  }
}
const data: Root = {
  success: true,
  data: {
    '702': {
      '지점 합계': {
        totalMonthlyCumulative: 298,
        generalMonthlyCumulative: 230,
        consignmentMonthlyCumulative: 65,
        leaseMonthlyCumulative: 3,
        purchasePrice: 5984224849,
        stockValuationAmount: 8339783334,
        stockValuationProfit: 3300936962,
        avgProcessingPeriodStockCount: 13.019236923076921,
        avgAdPeriodStockCount: 6.964296428571429,
        avgViewsStockCount: 12.578948684210527,
        avgCallsStockCount: 0,
        count_avgProcessingPeriodStockCount: 260,
        count_avgAdPeriodStockCount: 28,
        count_avgViewsStockCount: 380,
        count_avgCallsStockCount: 596,
        normalCount: 101,
        interestedCount: 8,
        longTermCount: 189,
        processingStockCount: 19,
        adPreparingStockCount: 111,
        ad702StockCount: 3,
        adKrStockCount: 0,
        adEncarStockCount: 18,
        adOtherStockCount: 0,
        previousLongTermCount: 189,
        previousAdPreparingStockCount: 111,
        live_chat_inq_count: 38,
        phone_inq_count: 73,
        kassStProfitFinal: 38170909,
      },
      장안평: {
        branchCd: 603,
        branchName: '702_장안평',
        totalMonthlyCumulative: '38',
        generalMonthlyCumulative: '37',
        consignmentMonthlyCumulative: '1',
        leaseMonthlyCumulative: '0',
        live_chat_inq_count: '1',
        phone_inq_count: '5',
        purchasePrice: '1637423110',
        stockValuationAmount: '2112500001',
        stockValuationProfit: '1363834711',
        avgProcessingPeriodStockCount: '20.5946',
        count_avgProcessingPeriodStockCount: '37',
        avgAdPeriodStockCount: '24.1667',
        count_avgAdPeriodStockCount: '6',
        avgViewsStockCount: '78.2353',
        count_avgViewsStockCount: '34',
        avgCallsStockCount: 0,
        count_avgCallsStockCount: '38',
        normalCount: '4',
        interestedCount: '3',
        longTermCount: '31',
        processingStockCount: '0',
        adPreparingStockCount: '5',
        ad702StockCount: '0',
        adKrStockCount: '0',
        adEncarStockCount: '0',
        adOtherStockCount: '0',
        kassStProfitFinal: '38170909',
        previousLongTermCount: 31,
        previousAdPreparingStockCount: 5,
      },
      김포: {
        branchCd: 606,
        branchName: '702_김포',
        totalMonthlyCumulative: '132',
        generalMonthlyCumulative: '70',
        consignmentMonthlyCumulative: '62',
        leaseMonthlyCumulative: '0',
        live_chat_inq_count: '0',
        phone_inq_count: '0',
        purchasePrice: '1044777390',
        stockValuationAmount: '1034500000',
        stockValuationProfit: '139858668',
        avgProcessingPeriodStockCount: '81.8667',
        count_avgProcessingPeriodStockCount: '15',
        avgAdPeriodStockCount: '0.0000',
        count_avgAdPeriodStockCount: '2',
        avgViewsStockCount: '2.9412',
        count_avgViewsStockCount: '34',
        avgCallsStockCount: 0,
        count_avgCallsStockCount: '132',
        normalCount: '50',
        interestedCount: '0',
        longTermCount: '82',
        processingStockCount: '14',
        adPreparingStockCount: '85',
        ad702StockCount: '0',
        adKrStockCount: '0',
        adEncarStockCount: '0',
        adOtherStockCount: '0',
        kassStProfitFinal: '0',
        previousLongTermCount: 82,
        previousAdPreparingStockCount: 85,
      },
      용인: {
        branchCd: 608,
        branchName: '702_용인',
        totalMonthlyCumulative: '92',
        generalMonthlyCumulative: '88',
        consignmentMonthlyCumulative: '2',
        leaseMonthlyCumulative: '2',
        live_chat_inq_count: '2',
        phone_inq_count: '6',
        purchasePrice: '2586678564',
        stockValuationAmount: '4387483333',
        stockValuationProfit: '1461206663',
        avgProcessingPeriodStockCount: '15.2955',
        count_avgProcessingPeriodStockCount: '44',
        avgAdPeriodStockCount: '3.6667',
        count_avgAdPeriodStockCount: '3',
        avgViewsStockCount: '18.6000',
        count_avgViewsStockCount: '90',
        avgCallsStockCount: 0,
        count_avgCallsStockCount: '92',
        normalCount: '43',
        interestedCount: '4',
        longTermCount: '45',
        processingStockCount: '5',
        adPreparingStockCount: '15',
        ad702StockCount: '2',
        adKrStockCount: '0',
        adEncarStockCount: '2',
        adOtherStockCount: '0',
        kassStProfitFinal: '0',
        previousLongTermCount: 45,
        previousAdPreparingStockCount: 15,
      },
      대구: {
        branchCd: 640,
        branchName: '702_대구',
        totalMonthlyCumulative: '32',
        generalMonthlyCumulative: '31',
        consignmentMonthlyCumulative: '0',
        leaseMonthlyCumulative: '1',
        live_chat_inq_count: '0',
        phone_inq_count: '0',
        purchasePrice: '616237289',
        stockValuationAmount: '694100000',
        stockValuationProfit: '301618899',
        avgProcessingPeriodStockCount: '23.3333',
        count_avgProcessingPeriodStockCount: '30',
        avgAdPeriodStockCount: '17.5000',
        count_avgAdPeriodStockCount: '2',
        avgViewsStockCount: '6.0357',
        count_avgViewsStockCount: '28',
        avgCallsStockCount: 0,
        count_avgCallsStockCount: '32',
        normalCount: '3',
        interestedCount: '1',
        longTermCount: '28',
        processingStockCount: '0',
        adPreparingStockCount: '6',
        ad702StockCount: '0',
        adKrStockCount: '0',
        adEncarStockCount: '16',
        adOtherStockCount: '0',
        kassStProfitFinal: '0',
        previousLongTermCount: 28,
        previousAdPreparingStockCount: 6,
      },
      강남: {
        branchCd: 772,
        branchName: '702_강남',
        totalMonthlyCumulative: '3',
        generalMonthlyCumulative: '3',
        consignmentMonthlyCumulative: '0',
        leaseMonthlyCumulative: '0',
        live_chat_inq_count: '35',
        phone_inq_count: '62',
        purchasePrice: '78108496',
        stockValuationAmount: '86200000',
        stockValuationProfit: '31236203',
        avgProcessingPeriodStockCount: '7.3333',
        count_avgProcessingPeriodStockCount: '3',
        avgAdPeriodStockCount: null,
        count_avgAdPeriodStockCount: '0',
        avgViewsStockCount: '50.3333',
        count_avgViewsStockCount: '3',
        avgCallsStockCount: 0,
        count_avgCallsStockCount: '3',
        normalCount: '0',
        interestedCount: '0',
        longTermCount: '3',
        processingStockCount: '0',
        adPreparingStockCount: '0',
        ad702StockCount: '1',
        adKrStockCount: '0',
        adEncarStockCount: '0',
        adOtherStockCount: '0',
        kassStProfitFinal: '0',
        previousLongTermCount: 3,
        previousAdPreparingStockCount: 0,
      },
      부산: {
        branchCd: 774,
        branchName: '702_부산',
        totalMonthlyCumulative: '1',
        generalMonthlyCumulative: '1',
        consignmentMonthlyCumulative: '0',
        leaseMonthlyCumulative: '0',
        live_chat_inq_count: '0',
        phone_inq_count: '0',
        purchasePrice: '21000000',
        stockValuationAmount: '25000000',
        stockValuationProfit: '3181818',
        avgProcessingPeriodStockCount: '0.0000',
        count_avgProcessingPeriodStockCount: '1',
        avgAdPeriodStockCount: '4.0000',
        count_avgAdPeriodStockCount: '1',
        avgViewsStockCount: '26.0000',
        count_avgViewsStockCount: '1',
        avgCallsStockCount: 0,
        count_avgCallsStockCount: '1',
        normalCount: '1',
        interestedCount: '0',
        longTermCount: '0',
        processingStockCount: '0',
        adPreparingStockCount: '0',
        ad702StockCount: '0',
        adKrStockCount: '0',
        adEncarStockCount: '0',
        adOtherStockCount: '0',
        kassStProfitFinal: '0',
        previousLongTermCount: 0,
        previousAdPreparingStockCount: 0,
      },
      광주: {
        branchCd: 780,
        branchName: '702_광주',
        totalMonthlyCumulative: '0',
        generalMonthlyCumulative: '0',
        consignmentMonthlyCumulative: '0',
        leaseMonthlyCumulative: '0',
        live_chat_inq_count: '0',
        phone_inq_count: '0',
        purchasePrice: null,
        stockValuationAmount: '0',
        stockValuationProfit: '0',
        avgProcessingPeriodStockCount: null,
        count_avgProcessingPeriodStockCount: '0',
        avgAdPeriodStockCount: null,
        count_avgAdPeriodStockCount: '0',
        avgViewsStockCount: null,
        count_avgViewsStockCount: '0',
        avgCallsStockCount: 0,
        count_avgCallsStockCount: '0',
        normalCount: '0',
        interestedCount: '0',
        longTermCount: '0',
        processingStockCount: '0',
        adPreparingStockCount: '0',
        ad702StockCount: '0',
        adKrStockCount: '0',
        adEncarStockCount: '0',
        adOtherStockCount: '0',
        kassStProfitFinal: '0',
        previousLongTermCount: 0,
        previousAdPreparingStockCount: 0,
      },
    },
    BPS: {
      '지점 합계': {
        totalMonthlyCumulative: 15,
        generalMonthlyCumulative: 14,
        consignmentMonthlyCumulative: 0,
        leaseMonthlyCumulative: 1,
        purchasePrice: 1272523633,
        stockValuationAmount: 1296400000,
        stockValuationProfit: 45070143,
        avgProcessingPeriodStockCount: 19.5,
        avgAdPeriodStockCount: 0,
        avgViewsStockCount: 15.3077,
        avgCallsStockCount: 0,
        count_avgProcessingPeriodStockCount: 20,
        count_avgAdPeriodStockCount: 2,
        count_avgViewsStockCount: 26,
        count_avgCallsStockCount: 30,
        normalCount: 5,
        interestedCount: 0,
        longTermCount: 10,
        processingStockCount: 0,
        adPreparingStockCount: 0,
        ad702StockCount: 5,
        adKrStockCount: 3,
        adEncarStockCount: 4,
        adOtherStockCount: 0,
        previousLongTermCount: 10,
        previousAdPreparingStockCount: 0,
        live_chat_inq_count: 0,
        phone_inq_count: 0,
        kassStProfitFinal: 5509667,
      },
      광주: {
        branchCd: 594,
        branchName: 'BPS_광주',
        totalMonthlyCumulative: '15',
        generalMonthlyCumulative: '14',
        consignmentMonthlyCumulative: '0',
        leaseMonthlyCumulative: '1',
        live_chat_inq_count: '0',
        phone_inq_count: '0',
        purchasePrice: '1272523633',
        stockValuationAmount: '1296400000',
        stockValuationProfit: '45070143',
        avgProcessingPeriodStockCount: '39.0000',
        count_avgProcessingPeriodStockCount: '10',
        avgAdPeriodStockCount: '0.0000',
        count_avgAdPeriodStockCount: '1',
        avgViewsStockCount: '30.6154',
        count_avgViewsStockCount: '13',
        avgCallsStockCount: 0,
        count_avgCallsStockCount: '15',
        normalCount: '5',
        interestedCount: '0',
        longTermCount: '10',
        processingStockCount: '0',
        adPreparingStockCount: '0',
        ad702StockCount: '5',
        adKrStockCount: '3',
        adEncarStockCount: '4',
        adOtherStockCount: '0',
        kassStProfitFinal: '5509667',
        previousLongTermCount: 10,
        previousAdPreparingStockCount: 0,
      },
    },
    SELEKT: {
      '지점 합계': {
        totalMonthlyCumulative: 75,
        generalMonthlyCumulative: 72,
        consignmentMonthlyCumulative: 0,
        leaseMonthlyCumulative: 3,
        purchasePrice: 3996108824,
        stockValuationAmount: 4380000000,
        stockValuationProfit: -2655479298,
        avgProcessingPeriodStockCount: 13.33335,
        avgAdPeriodStockCount: 24.5,
        avgViewsStockCount: 25.6103,
        avgCallsStockCount: 0,
        count_avgProcessingPeriodStockCount: 144,
        count_avgAdPeriodStockCount: 6,
        count_avgViewsStockCount: 136,
        count_avgCallsStockCount: 150,
        normalCount: 7,
        interestedCount: 1,
        longTermCount: 67,
        processingStockCount: 3,
        adPreparingStockCount: 3,
        ad702StockCount: 30,
        adKrStockCount: 6,
        adEncarStockCount: 24,
        adOtherStockCount: 0,
        previousLongTermCount: 67,
        previousAdPreparingStockCount: 3,
        live_chat_inq_count: 9,
        phone_inq_count: 18,
        kassStProfitFinal: 55222834,
      },
      김포: {
        branchCd: 601,
        branchName: 'SELEKT_김포',
        totalMonthlyCumulative: '75',
        generalMonthlyCumulative: '72',
        consignmentMonthlyCumulative: '0',
        leaseMonthlyCumulative: '3',
        live_chat_inq_count: '9',
        phone_inq_count: '18',
        purchasePrice: '3996108824',
        stockValuationAmount: '4380000000',
        stockValuationProfit: '-2655479298',
        avgProcessingPeriodStockCount: '26.6667',
        count_avgProcessingPeriodStockCount: '72',
        avgAdPeriodStockCount: '49.0000',
        count_avgAdPeriodStockCount: '3',
        avgViewsStockCount: '51.2206',
        count_avgViewsStockCount: '68',
        avgCallsStockCount: 0,
        count_avgCallsStockCount: '75',
        normalCount: '7',
        interestedCount: '1',
        longTermCount: '67',
        processingStockCount: '3',
        adPreparingStockCount: '3',
        ad702StockCount: '30',
        adKrStockCount: '6',
        adEncarStockCount: '24',
        adOtherStockCount: '0',
        kassStProfitFinal: '55222834',
        previousLongTermCount: 67,
        previousAdPreparingStockCount: 3,
      },
    },
    'R-R': {
      '지점 합계': {
        totalMonthlyCumulative: 0,
        generalMonthlyCumulative: 0,
        consignmentMonthlyCumulative: 0,
        leaseMonthlyCumulative: 0,
        purchasePrice: 0,
        stockValuationAmount: 0,
        stockValuationProfit: 0,
        avgProcessingPeriodStockCount: 0,
        avgAdPeriodStockCount: 0,
        avgViewsStockCount: 0,
        avgCallsStockCount: 0,
        count_avgProcessingPeriodStockCount: 0,
        count_avgAdPeriodStockCount: 0,
        count_avgViewsStockCount: 0,
        count_avgCallsStockCount: 0,
        normalCount: 0,
        interestedCount: 0,
        longTermCount: 0,
        processingStockCount: 0,
        adPreparingStockCount: 0,
        ad702StockCount: 0,
        adKrStockCount: 0,
        adEncarStockCount: 0,
        adOtherStockCount: 0,
        previousLongTermCount: 0,
        previousAdPreparingStockCount: 0,
        live_chat_inq_count: 0,
        phone_inq_count: 0,
        kassStProfitFinal: 0,
      },
      판교: {
        branchCd: 440,
        branchName: 'RR 판교',
        totalMonthlyCumulative: '0',
        generalMonthlyCumulative: '0',
        consignmentMonthlyCumulative: '0',
        leaseMonthlyCumulative: '0',
        live_chat_inq_count: '0',
        phone_inq_count: '0',
        purchasePrice: null,
        stockValuationAmount: '0',
        stockValuationProfit: '0',
        avgProcessingPeriodStockCount: null,
        count_avgProcessingPeriodStockCount: '0',
        avgAdPeriodStockCount: null,
        count_avgAdPeriodStockCount: '0',
        avgViewsStockCount: null,
        count_avgViewsStockCount: '0',
        avgCallsStockCount: 0,
        count_avgCallsStockCount: '0',
        normalCount: '0',
        interestedCount: '0',
        longTermCount: '0',
        processingStockCount: '0',
        adPreparingStockCount: '0',
        ad702StockCount: '0',
        adKrStockCount: '0',
        adEncarStockCount: '0',
        adOtherStockCount: '0',
        kassStProfitFinal: '0',
        previousLongTermCount: 0,
        previousAdPreparingStockCount: 0,
      },
    },
    전체: {
      totalMonthlyCumulative: 388,
      generalMonthlyCumulative: 316,
      consignmentMonthlyCumulative: 65,
      leaseMonthlyCumulative: 7,
      purchasePrice: 11252857306,
      stockValuationAmount: 14016183334,
      stockValuationProfit: 690527807,
      avgProcessingPeriodStockCount: 13.400009411764703,
      avgAdPeriodStockCount: 9.243251351351352,
      avgViewsStockCount: 15.950279005524862,
      avgCallsStockCount: 0,
      count_avgProcessingPeriodStockCount: 424,
      count_avgAdPeriodStockCount: 36,
      count_avgViewsStockCount: 542,
      count_avgCallsStockCount: 776,
      normalCount: 113,
      interestedCount: 9,
      longTermCount: 266,
      processingStockCount: 22,
      adPreparingStockCount: 114,
      ad702StockCount: 38,
      adKrStockCount: 9,
      adEncarStockCount: 46,
      adOtherStockCount: 0,
      previousLongTermCount: 266,
      previousAdPreparingStockCount: 114,
      live_chat_inq_count: 47,
      phone_inq_count: 91,
      kassStProfitFinal: 98903410,
    },
  },
}

function RouteComponent() {
  const flatData = useMemo(() => {
    const flat: Array<Data> = []

    for (const [category, item] of Object.entries(data.data)) {
      if (category === '전체') {
        flat.push({
          ...item,
          category,
          branchName: '전체',
        })
        continue
      }

      for (const [branchKey, branch] of Object.entries(item as BranchGroup)) {
        flat.push({
          ...branch,
          category,
          branchName: branch.branchName ?? branchKey,
        })
      }
    }

    console.log(flat)

    return flat
  }, [])

  const columns: ColumnsType<Data> = useMemo(() => {
    const cols: ColumnsType<Data> = [
      {
        key: 'none',
        title: <>구분</>,
        colSpan: 2,

        children: [
          {
            colSpan: 1,
            rowSpan: 0,
            key: 'category',
            dataIndex: 'category',
            onCell: (_, index) => {
              if (index === 0) {
                return {
                  rowSpan: 8,
                }
              } else if (index === 8) {
                return {
                  rowSpan: 2,
                }
              } else if (index === 10) {
                return {
                  rowSpan: 2,
                }
              } else if (index === 12) {
                return {
                  rowSpan: 2,
                }
              }
              return {}
            },
          },
        ],
      },
      // {
      //   key: 'branchName',
      //   title: <>지점명</>,
      //   render(value, record, index) {
      //     if (record.category) {
      //       return <>a</>
      //     }
      //     return <>abc</>
      //   },
      // },
      // {
      //   key: 'stockCount',
      //   title: <>재고대수</>,
      //   children: [
      //     {
      //       key: 'totalMonthlyCumulative',
      //       dataIndex: 'totalMonthlyCumulative',
      //       title: <>전체재고</>,
      //     },
      //     {
      //       key: 'generalMonthlyCumulative',
      //       dataIndex: 'generalMonthlyCumulative',
      //       title: <>일반</>,
      //     },
      //     {
      //       key: 'consignmentMonthlyCumulative',
      //       dataIndex: 'consignmentMonthlyCumulative',
      //       title: <>위탁</>,
      //     },
      //     {
      //       key: 'leaseMonthlyCumulative',
      //       dataIndex: 'leaseMonthlyCumulative',
      //       title: <>리스</>,
      //     },
      //   ],
      // },
      // {
      //   key: 'amount',
      //   title: <>금액</>,
      //   children: [
      //     {
      //       key: 'purchasePrice',
      //       dataIndex: 'purchasePrice',
      //       title: <>매입가</>,
      //     },
      //     {
      //       key: 'stockValuationAmount',
      //       dataIndex: 'stockValuationAmount',
      //       title: <>재고평가금액</>,
      //     },
      //     {
      //       key: 'stockValuationProfit',
      //       dataIndex: 'stockValuationProfit',
      //       title: <>재고추정이익</>,
      //     },
      //     {
      //       key: 'kassStProfitFinal',
      //       dataIndex: 'kassStProfitFinal',
      //       title: <>KASS 재고평가이익</>,
      //     },
      //   ],
      // },
      // {
      //   key: 'adMetric',
      //   title: <>평균광고지표</>,
      //   children: [
      //     {
      //       key: 'avgProcessingPeriodStockCount',
      //       dataIndex: 'avgProcessingPeriodStockCount',
      //       title: <>상품화기간</>,
      //     },
      //     {
      //       key: 'avgAdPeriodStockCount',
      //       dataIndex: 'avgAdPeriodStockCount',
      //       title: <>광고기간</>,
      //     },
      //     {
      //       key: 'avgViewsStockCount',
      //       dataIndex: 'avgViewsStockCount',
      //       title: <>조회수</>,
      //     },
      //   ],
      // },
      // {
      //   key: 'normalCount',
      //   dataIndex: 'normalCount',
      //   title: <>정상재고(-30일)</>,
      // },
      // {
      //   key: 'interestedCount',
      //   dataIndex: 'interestedCount',
      //   title: <>관심재고(31-60일)</>,
      // },
      // {
      //   key: 'longTermCount',
      //   dataIndex: 'longTermCount',
      //   title: <>장기재고(61일~)</>,
      // },
      // {
      //   key: 'vehicleStateClassification',
      //   title: <>차량 상태 분류</>,
      //   children: [
      //     {
      //       key: 'processingStockCount',
      //       dataIndex: 'processingStockCount',
      //       title: <>상품화중</>,
      //     },
      //     {
      //       key: 'adPreparingStockCount',
      //       dataIndex: 'adPreparingStockCount',
      //       title: <>광고준비중</>,
      //     },
      //     {
      //       key: 'ad702StockCount',
      //       dataIndex: 'ad702StockCount',
      //       title: <>702 광고</>,
      //     },
      //     {
      //       key: 'adKrStockCount',
      //       dataIndex: 'adKrStockCount',
      //       title: <>KR 광고</>,
      //     },
      //     {
      //       key: 'adEncarStockCount',
      //       dataIndex: 'adEncarStockCount',
      //       title: <>엔카 광고</>,
      //     },
      //     {
      //       key: 'adOtherStockCount',
      //       dataIndex: 'adOtherStockCount',
      //       title: <>기타 광고</>,
      //     },
      //   ],
      // },
      // {
      //   key: 'counselHistory',
      //   title: <>702_상담이력</>,
      //   children: [
      //     {
      //       key: 'phone_inq_count',
      //       dataIndex: 'phone_inq_count',
      //       title: <>전화</>,
      //     },
      //     {
      //       key: 'live_chat_inq_count',
      //       dataIndex: 'live_chat_inq_count',
      //       title: <>채팅</>,
      //     },
      //   ],
      // },
    ]
    return cols
  }, [flatData])

  return (
    <Table<Data>
      columns={columns}
      dataSource={flatData}
      bordered
      footer={undefined}
    />
  )
}
