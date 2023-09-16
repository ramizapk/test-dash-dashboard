import Card from "@/Components/Card"
import Layout from "@/layout/Layout"

export default function Index() {
  return (
    <Layout>
      <div
        className='grid grid-cols-4 my-0 gap-4 md:grid-cols-1 py-0 text-black w-full'
        dir='rtl'
      >
        <Card
          id='1'
          icon={<BsHouseDoor size={69} color='#f584' />}
          title='عدد العقارات'
          value={statistics.statistics.totalRealEstates}
          label='العدد الاجمالي'
        />
        <Card
          id=''
          icon={<BsHouseDoor size={69} color='#f584' />}
          title='العقارات المتاحة'
          value={statistics.availableRealEstates}
          label='العدد الاجمالي'
        />
        <Card
          id='1'
          icon={<BsHouseDoor size={69} color='#f584' />}
          title='عقارات للبيع'
          value={statistics.realEstatesForSale}
          label='العدد الاجمالي'
        />
        <Card
          id='1'
          icon={<BsHouseDoor size={69} color='#f584' />}
          title='عقارات للايجار'
          value={statistics.realEstatesForRent}
          label='العدد الاجمالي'
        />
      </div>
    </Layout>
  )
}
