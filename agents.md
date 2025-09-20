# Buckler Investments Group - AI Agent Context & Development Guide

## Project Overview

Buckler Investments Group is a **super platform ecosystem** integrating multiple business domains into a unified marketplace targeting East Africa:

- 🏠 **Property Listings** - Real estate marketplace
- 💼 **Investment Platform** - Financial products and opportunities  
- 🏖️ **Short-term Rentals (BnB)** - Airbnb-style accommodations
- 🚗 **Tours** - Travel packages and experiences
- 🚙 **Vehicle Rentals** - Car rental services

## Architecture Overview

### Tech Stack
- **Backend**: FastAPI with Onion Architecture
- **Frontend**: React + Litho template system
- **Admin**: React + DashLite template system
- **Database**: PostgreSQL with SQLAlchemy
- **State Management**: React Query for data fetching/caching

### Layer Structure (Onion Architecture)
```
API Layer → Application Layer → Domain Layer
     ↑                ↑               ↑
Infrastructure ──────┘              Core
```

---

## Backend Standards & Patterns

### Core Principles
- **Strict Onion Architecture** - No dependency violations between layers
- **Dependency Injection** - All external dependencies injected via containers
- **Clean Separation** - Each layer has clear responsibilities
- **Type Safety** - Full type annotations required
- **Integer IDs Only** - No UUIDs or string identifiers

### HTTP Method Conventions
**ONLY GET and POST methods allowed:**
- **POST**: All mutations (create/update)
  - Create: `{"id": 0, ...data}`
  - Update: `{"id": actual_id, ...data}`
- **GET**: All retrieval and deletion
  - Retrieve: `GET /endpoint` or `GET /endpoint/{id}`
  - Delete: `GET /endpoint/{id}/delete`

### Layer Responsibilities

#### 1. Domain Layer (Pure Business Logic)
**Location**: `app/domain/`
**Rules**: 
- ❌ NO external dependencies (no FastAPI, SQLAlchemy, requests, etc.)
- ✅ Pure Python classes, business rules, abstract interfaces
- ✅ Value objects, entities, repository interfaces

```python
# ✅ CORRECT Domain Entity
class Property:
    def __init__(self, id: int, title: str, price: Money):
        self.id = id
        self.title = title
        self.price = price
    
    def publish(self) -> None:
        """Business rule: validate before publishing"""
        if not self.title:
            raise ValueError("Cannot publish without title")
```

#### 2. Application Layer (Use Cases & DTOs)
**Location**: `app/application/`
**Rules**:
- ✅ Domain imports allowed
- ✅ Pydantic DTOs for API contracts
- ❌ NO FastAPI imports
- ❌ NO direct infrastructure imports

```python
# ✅ CORRECT Use Case
class CreatePropertyUseCase:
    def __init__(self, repository: PropertyRepository):
        self._repository = repository
    
    async def execute(self, request: PropertyCreateDTO) -> PropertyResponseDTO:
        # Business workflow orchestration
        entity = Property(...)
        saved = await self._repository.create(entity)
        return PropertyResponseDTO.from_entity(saved)
```

#### 3. Infrastructure Layer (External Dependencies)
**Location**: `app/infrastructure/`
**Rules**:
- ✅ Implements domain interfaces
- ✅ Database, external APIs, file systems
- ✅ SQLAlchemy models and repositories

#### 4. API Layer (HTTP Controllers)
**Location**: `app/api/v1/`
**Rules**:
- ✅ HTTP request/response handling
- ✅ Dependency injection with `@inject`
- ❌ NO business logic in controllers

```python
# ✅ CORRECT API Route
@router.post("/", response_model=PropertyResponseDTO)
@inject
async def create_property(
    request: PropertyCreateDTO,
    use_case: CreatePropertyUseCase = Depends(Provide[...])
) -> PropertyResponseDTO:
    return await use_case.execute(request)
```

### Business Domain Routing
```
/api/v1/
├── property/          # Property listings
├── investment/        # Investment products
├── bnb/              # Short-term rentals
├── tours/            # Tour packages
├── cars/             # Vehicle rentals
└── shared/           # Auth, users, media
```

### Testing Strategy
- **Domain**: 100% coverage (pure business logic)
- **Application**: 95% coverage (use cases)
- **Infrastructure**: 80% coverage (external dependencies)
- **API**: 90% coverage (HTTP handling)

### FastAPI Backend Standards

#### Core Principles
- Follow **Onion Architecture** principles strictly
- Use **dependency injection** for all external dependencies
- Maintain **clean separation** between layers
- Write **type-safe** code with proper annotations

#### Architecture Layers (Onion Architecture)
```
API Layer → Application Layer → Domain Layer
     ↑                ↑               ↑
Infrastructure ──────┘              Core
```

#### ID Standards
- **ALL IDs must be integers (`int`)** - no UUIDs or strings
- Use `id: int` for all entity identifiers
- Foreign keys must also be `int` type

#### HTTP Methods (Simplified Convention)
We only use **GET** and **POST** methods:

### POST Method Usage
- **Create new record**: POST with `id: 0` in request body
- **Update existing record**: POST with actual `id` in request body
- All data mutations (create/update) use POST

### GET Method Usage
- **Retrieve records**: GET `/endpoint` or GET `/endpoint/{id}`
- **Delete records**: GET `/endpoint/{id}/delete`
- All data retrieval and deletion use GET

#### FastAPI Route Structure

##### Path Operation Organization
```python
# Group routes by business domain
from fastapi import APIRouter

router = APIRouter(
    prefix="/api/v1/domain",
    tags=["domain"],
    responses={404: {"description": "Not found"}},
)
```

##### Route Definition Standards
```python
# ✅ CORRECT: Use dependency injection from application layer
@router.post("/", response_model=EntityResponseDTO)
@inject
async def create_or_update_entity(
    request: EntityCreateUpdateDTO,
    use_case: CreateEntityUseCase = Depends(Provide[AppContainer.entity_use_cases.create_entity_use_case]),
) -> EntityResponseDTO:
    return await use_case.execute(request)

@router.get("/", response_model=List[EntityResponseDTO])
@inject
async def list_entities(
    use_case: ListEntitiesUseCase = Depends(Provide[AppContainer.entity_use_cases.list_entities_use_case]),
) -> List[EntityResponseDTO]:
    return await use_case.execute()

@router.get("/{entity_id}", response_model=EntityResponseDTO)
@inject
async def get_entity(
    entity_id: int,
    use_case: GetEntityUseCase = Depends(Provide[AppContainer.entity_use_cases.get_entity_use_case]),
) -> EntityResponseDTO:
    return await use_case.execute(entity_id)

@router.get("/{entity_id}/delete", response_model=dict)
@inject
async def delete_entity(
    entity_id: int,
    use_case: DeleteEntityUseCase = Depends(Provide[AppContainer.entity_use_cases.delete_entity_use_case]),
) -> dict:
    await use_case.execute(entity_id)
    return {"ok": True}
```

#### Dependency Injection Requirements

##### Container Configuration
```python
# ✅ CORRECT: Proper layered dependency injection
class AppContainer(containers.DeclarativeContainer):
    # Infrastructure Layer
    db_session = providers.Resource(AsyncSessionLocal)
    entity_repository = providers.Factory(SqlAlchemyEntityRepository, session=db_session)

    # Application Layer
    entity_use_cases = providers.Container(
        EntityUseCases,
        entity_repository=entity_repository,  # Infrastructure → Application
    )
```

##### Route Dependency Injection
```python
# ✅ REQUIRED: All routes must use @inject decorator
from dependency_injector.wiring import inject, Provide

@router.post("/entities", response_model=EntityResponseDTO)
@inject
async def create_entity(
    request: EntityCreateUpdateDTO,
    use_case: CreateEntityUseCase = Depends(Provide[AppContainer.entity_use_cases.create_entity_use_case]),
) -> EntityResponseDTO:
    # Business logic is in use case, not in route
    return await use_case.execute(request)
```

#### Pydantic Models (DTOs)

##### Request Models
```python
# For create/update operations
class EntityCreateUpdateDTO(BaseModel):
    id: int = 0  # 0 for create, actual ID for update
    name: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
```

##### Response Models
```python
class EntityResponseDTO(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
```

#### Error Handling

##### Standard HTTP Exceptions
```python
from fastapi import HTTPException

# 404 for not found
if not entity:
    raise HTTPException(status_code=404, detail="Entity not found")

# 400 for bad request
if entity_id <= 0:
    raise HTTPException(status_code=400, detail="Invalid entity ID")
```

#### Type Annotations

##### Function Signatures
```python
# ✅ REQUIRED: Full type annotations
async def create_entity(
    entity_data: EntityCreateUpdateDTO,
    repository: EntityRepository
) -> EntityResponseDTO:
    # Implementation
```

##### Database Models
```python
# ✅ REQUIRED: SQLAlchemy with type hints
class EntityModel(Base):
    __tablename__ = "entities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
```

#### FORBIDDEN Patterns

##### ❌ DO NOT: Direct database access in routes
```python
# ❌ WRONG: Never access database directly in routes
@router.post("/entities")
async def create_entity(session: Session = Depends(get_session)):
    # Direct database access - FORBIDDEN
```

##### ❌ DO NOT: Business logic in routes
```python
# ❌ WRONG: Business logic belongs in use cases
@router.post("/entities")
async def create_entity(request: EntityDTO):
    # Complex business logic here - FORBIDDEN
    if complex_business_rule():
        # This belongs in domain/use cases
```

##### ❌ DO NOT: Non-integer IDs
```python
# ❌ WRONG: All IDs must be int
class Entity(BaseModel):
    id: str  # FORBIDDEN
    id: UUID  # FORBIDDEN
```

##### ❌ DO NOT: Other HTTP methods
```python
# ❌ WRONG: Only GET and POST allowed
@router.put("/entities/{id}")  # FORBIDDEN
@router.patch("/entities/{id}")  # FORBIDDEN
@router.delete("/entities/{id}")  # FORBIDDEN
```

#### Required Dependencies
```python
# FastAPI core
from fastapi import FastAPI, APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse

# Dependency injection
from dependency_injector.wiring import inject, Provide
from dependency_injector import containers, providers

# Type hints
from typing import List, Optional, Union
from pydantic import BaseModel, ConfigDict

# Async support
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
```

---

## Frontend Standards & Patterns

### Tech Stack
- **React 18** with functional components and hooks
- **Litho Template** - Premium React template for user-facing pages
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling

### Core Principles
- **Litho Component Reuse** - Always prefer existing Litho components
- **Presentational vs Container** - Separate data fetching from UI
- **React Query** - All API calls through hooks
- **Type Safety** - TypeScript for new code

### Component Hierarchy
```
frontend/src/
├── Components/        # Reusable Litho components
├── Pages/            # Page-level compositions
├── api/              # API service functions
├── hooks/            # Custom React hooks
└── Assets/           # Styles, images, fonts
```

### API Integration Patterns

#### Service Layer
```javascript
// api/propertyService.js
export const searchProperties = async (criteria = {}) => {
    const { data } = await axiosInstance.post('/property/search', criteria)
    return data
}

export const getProperty = async (id) => {
    const { data } = await axiosInstance.get(`/property/${id}`)
    return data
}
```

#### React Query Hooks
```javascript
// hooks/useProperties.js
export const useProperties = (filters = {}) => {
    return useQuery({
        queryKey: ['properties', filters],
        queryFn: () => searchProperties(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

export const useCreateProperty = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createProperty,
        onSuccess: () => {
            queryClient.invalidateQueries(['properties'])
        }
    })
}
```

#### Component Integration
```jsx
// pages/PropertyListPage.jsx
const PropertyListPage = () => {
    const [filters, setFilters] = useState({})
    const { data: properties, isLoading } = useProperties(filters)

    if (isLoading) return <PropertySkeleton />

    return (
        <div>
            <PropertyFilters onChange={setFilters} />
            <PropertyGrid properties={properties} />
        </div>
    )
}
```

### Litho Component Reuse Priority
1. **Existing Litho components** from `Components/`
2. **Complete sections** from `Pages/Home/*`
3. **Layout patterns** from `Pages/Portfolios/*`
4. **Utility components** (modals, forms, etc.)
5. **Create new only** when no equivalent exists

### Page Composition Patterns
- **Hero Sections**: `Pages/Home/TravelAgency.jsx` patterns
- **Property Grids**: `Pages/Portfolios/PortfolioClassicThreeColumn.jsx`
- **Booking Forms**: `Pages/Contact/ContactUsSimplePage.jsx` patterns
- **Image Galleries**: `Components/ImageGallery/*`

### Styling Conventions
- **Reuse First**: Existing SCSS in `Assets/scss/`
- **Tailwind Classes**: Use existing utility patterns
- **Motion**: Reuse from `Functions/GlobalAnimations.js`
- **Responsive**: React-bootstrap Grid system

### Advanced Frontend Patterns

#### Component Service Integration
```jsx
// Component patterns for integrating API services and hooks
const ListingsPage = () => {
    const [filters, setFilters] = useState({})
    const { listings, isLoading, error } = useListings(filters)

    if (isLoading) {
        return <ListingsSkeleton />
    }

    if (error) {
        return <ErrorMessage error={error} />
    }

    return (
        <div>
            <Filters onChange={setFilters} />
            <ListingsGrid listings={listings} />
        </div>
    )
}

// Form components with mutations
const BookingForm = ({ listingId }) => {
    const navigate = useNavigate()
    const createBooking = useCreateBooking()

    const handleSubmit = async (data) => {
        try {
            await createBooking.mutateAsync({
                listingId,
                ...data,
                id: 0 // Follow backend pattern
            })
            navigate('/bookings/success')
        } catch (error) {
            // Error handled by mutation onError
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <DatePicker name="checkIn" />
            <DatePicker name="checkOut" />
            <Button
                type="submit"
                disabled={createBooking.isLoading}
            >
                {createBooking.isLoading ? 'Creating...' : 'Book Now'}
            </Button>
        </Form>
    )
}
```

#### Error Handling Patterns
```jsx
// Error boundaries
class PropertyErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.error('Property component error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <MessageBox
                    theme="message-box01"
                    variant="error"
                    message="Something went wrong loading properties. Please try again."
                />
            )
        }

        return this.props.children
    }
}

// Inline error handling
const SearchResults = ({ query }) => {
    const { results, isLoading, error } = useSearch(query)

    if (isLoading) return <SearchSkeleton />
    if (error) return <SearchError error={error} onRetry={() => {}} />

    return (
        <div>
            {results.posts?.map(post => (
                <SearchResultItem key={post.id} item={post} />
            ))}
            {results.users?.map(user => (
                <UserResultItem key={user.id} item={user} />
            ))}
        </div>
    )
}
```

#### Loading State Patterns
```jsx
// Skeleton components
const ListingsSkeleton = () => (
    <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                    <div className="bg-gray-200 h-4 w-3/4"></div>
                    <div className="bg-gray-200 h-4 w-1/2"></div>
                </div>
            </div>
        ))}
    </div>
)

// Progressive loading
const InfiniteListings = () => {
    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteListings()

    if (isLoading) return <ListingsSkeleton />

    return (
        <div>
            {data?.pages?.map((page, pageIndex) => (
                <div key={pageIndex}>
                    {page.map(listing => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            ))}

            {hasNextPage && (
                <LoadMoreButton
                    onClick={() => fetchNextPage()}
                    loading={isFetchingNextPage}
                />
            )}
        </div>
    )
}
```

#### Optimistic Updates
```jsx
const FavoriteButton = ({ listingId, isFavorite }) => {
    const toggleFavorite = useToggleFavorite()

    const handleClick = () => {
        toggleFavorite.mutate({
            id: listingId,
            isFavorite: !isFavorite
        })
    }

    return (
        <Button
            onClick={handleClick}
            disabled={toggleFavorite.isLoading}
            className={isFavorite ? 'text-red-500' : 'text-gray-400'}
        >
            <HeartIcon filled={isFavorite} />
        </Button>
    )
}
```

#### React Hook Form Integration
```jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
    checkIn: z.date(),
    checkOut: z.date(),
    guests: z.number().min(1).max(10),
})

const BookingForm = ({ listingId }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    })

    const createBooking = useCreateBooking()

    const onSubmit = async (data) => {
        try {
            await createBooking.mutateAsync({
                listingId,
                ...data
            })
            // Success handled by mutation
        } catch (error) {
            // Error handled by mutation
        }
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <DatePicker {...register('checkIn')} error={errors.checkIn} />
            <DatePicker {...register('checkOut')} error={errors.checkOut} />
            <Input
                type="number"
                {...register('guests', { valueAsNumber: true })}
                error={errors.guests}
            />

            <Button
                type="submit"
                disabled={createBooking.isLoading}
            >
                {createBooking.isLoading ? 'Booking...' : 'Book Now'}
            </Button>
        </Form>
    )
}
```

#### Search and Filter Patterns
```jsx
const SearchBar = () => {
    const [query, setQuery] = useState('')
    const [debouncedQuery] = useDebounce(query, 300)
    const { suggestions, isLoading } = useSearchSuggestions(debouncedQuery)

    return (
        <div className="relative">
            <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations, tours, properties..."
            />

            {isLoading && <SearchSpinner />}

            {suggestions && (
                <SearchSuggestions
                    suggestions={suggestions}
                    onSelect={(suggestion) => {
                        setQuery(suggestion)
                        // Navigate or filter
                    }}
                />
            )}
        </div>
    )
}

const ListingsFilters = ({ filters, onChange }) => {
    const { filters: availableFilters } = useFilters()

    return (
        <div className="filters-panel">
            <Select
                value={filters.location}
                onChange={(value) => onChange({ ...filters, location: value })}
                options={availableFilters.locations}
                placeholder="Select location"
            />

            <RangeSlider
                min={availableFilters.priceRange.min}
                max={availableFilters.priceRange.max}
                value={filters.priceRange}
                onChange={(value) => onChange({ ...filters, priceRange: value })}
            />

            <Button onClick={() => onChange({})}>
                Clear Filters
            </Button>
        </div>
    )
}
```

#### Pagination Patterns
```jsx
// Cursor pagination (Properties)
const PropertiesList = ({ filters }) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useProperties(filters)

    return (
        <div>
            {data?.pages?.map((page, pageIndex) => (
                <div key={pageIndex}>
                    {page.items.map(property => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            ))}

            {hasNextPage && (
                <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    {isFetchingNextPage ? 'Loading...' : 'Load More'}
                </Button>
            )}
        </div>
    )
}

// Offset pagination (BnB/Tours/Cars)
const ListingsList = ({ filters }) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useListingsInfinite(filters)

    return (
        <div>
            {data?.pages?.map((page, pageIndex) => (
                <div key={pageIndex}>
                    {page.map(listing => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            ))}

            {hasNextPage && (
                <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    {isFetchingNextPage ? 'Loading...' : 'Load More'}
                </Button>
            )}
        </div>
    )
}
```

#### Component Composition Patterns
```jsx
// Container/Presentational split
const ListingsContainer = () => {
    const [filters, setFilters] = useState({})
    const { listings, isLoading, error } = useListings(filters)

    return (
        <ListingsPresentation
            listings={listings}
            isLoading={isLoading}
            error={error}
            filters={filters}
            onFiltersChange={setFilters}
        />
    )
}

// Presentation component (reusable with Litho components)
const ListingsPresentation = ({
    listings,
    isLoading,
    error,
    filters,
    onFiltersChange
}) => {
    if (isLoading) return <ListingsSkeleton />
    if (error) return <ErrorMessage error={error} />

    return (
        <div>
            <FiltersPanel filters={filters} onChange={onFiltersChange} />
            <ListingsGrid listings={listings} />
        </div>
    )
}
```

#### Performance Patterns
```jsx
// Memoization
const PropertyCard = React.memo(({ property, onClick }) => {
    return (
        <div onClick={() => onClick(property.id)}>
            <img src={property.image} alt={property.title} />
            <h3>{property.title}</h3>
            <p>{property.price}</p>
        </div>
    )
})

// Lazy loading
const PropertyDetail = lazy(() => import('./PropertyDetail'))

const PropertyCard = ({ property }) => {
    const [showDetail, setShowDetail] = useState(false)

    return (
        <div>
            {/* Card content */}
            {showDetail && (
                <Suspense fallback={<PropertyDetailSkeleton />}>
                    <PropertyDetail property={property} />
                </Suspense>
            )}
        </div>
    )
}
```

#### Accessibility Patterns
```jsx
// ARIA labels
const SearchInput = ({ value, onChange, suggestions }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            <input
                type="text"
                value={value}
                onChange={onChange}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-autocomplete="list"
                role="combobox"
            />

            {isOpen && suggestions && (
                <ul role="listbox">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={suggestion.id}
                            role="option"
                            aria-selected={index === 0}
                        >
                            {suggestion.text}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

// Focus management
const BookingModal = ({ isOpen, onClose, children }) => {
    const modalRef = useRef()

    useEffect(() => {
        if (isOpen) {
            modalRef.current?.focus()
        }
    }, [isOpen])

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose()
        }
    }

    return (
        <div
            ref={modalRef}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            aria-modal="true"
            role="dialog"
        >
            {children}
        </div>
    )
}
```

---

## Admin Dashboard Standards

### Tech Stack
- **React 18** with DashLite admin template
- **DashLite Components** - Professional admin UI system
- **React Query** - Admin data management
- **SCSS Architecture** - DashLite styling system

### Core Principles
- **DashLite Reuse** - Maximum component reuse from `admin/src/components/`
- **Admin-Specific Patterns** - Shorter cache times, aggressive invalidation
- **Data Management** - CRUD operations with optimistic updates
- **Performance** - Virtual scrolling, memoization, code splitting

### Component Structure
```
admin/src/
├── components/        # DashLite components
├── pages/            # Admin pages
├── hooks/            # Admin-specific hooks
├── api/              # Admin API services
└── assets/scss/      # DashLite SCSS
```

### Admin API Patterns
```javascript
// api/users.js
export const getUsers = async (params = {}) => {
    const { data } = await axiosPrivate.get('/admin/users', { params })
    return data
}

export const createUser = async (userData) => {
    const { data } = await axiosPrivate.post('/admin/users', {
        id: 0, // Admin creates with id=0
        ...userData
    })
    return data
}
```

### Admin Hook Patterns
```javascript
// hooks/useUsers.js
export const useUsers = (filters = {}) => {
    return useQuery({
        queryKey: ['admin', 'users', filters],
        queryFn: () => getUsers(filters),
        staleTime: 2 * 60 * 1000, // Shorter for admin
    })
}
```

### DashLite Component Integration
```jsx
// components/UserManagement.jsx
import { 
    Block, BlockHead, BlockContent, DataTable,
    Button, UserAvatar 
} from '@/components/Component'

const UserManagement = () => {
    const { data: users, isLoading } = useUsers()
    
    return (
        <Block>
            <BlockHead>
                <BlockTitle>User Management</BlockTitle>
            </BlockHead>
            <BlockContent>
                <DataTable>
                    {/* Admin table implementation */}
                </DataTable>
            </BlockContent>
        </Block>
    )
}
```

---

## API Communication Contracts

### Transport Layer
- **Base URL**: `/api/v1` (configurable)
- **Methods**: Only GET and POST
- **IDs**: Always integers
- **Authentication**: Bearer token in Authorization header

### Pagination Patterns
- **Cursor Pagination** (Properties): `{items: [...], has_more: boolean, cursor: string}`
- **Offset Pagination** (BnB/Tours/Cars): `{items: [...], total: number, offset: number}`

### Error Handling
- **401**: Token refresh attempt, then logout
- **400**: Validation errors with field mapping
- **500**: Generic error with retry option

### Data Flow
```
Component → Hook → Service → API → Backend
    ↑                                    ↓
React Query Cache ←─────────────── Response
```

---

## Development Workflow & Standards

### Code Quality
- **Functional Components**: Only hooks, no classes
- **Type Safety**: Full annotations for new code
- **Error Boundaries**: Graceful error handling
- **Performance**: Memoization where needed

### Testing Requirements
- **Unit Tests**: Pure functions and business logic
- **Integration Tests**: API endpoints and data flow
- **Component Tests**: User interactions and state
- **E2E Tests**: Critical user journeys

### Comprehensive Testing Standards

#### Testing Strategy by Layer

##### 1. Domain Layer Tests (`tests/unit/domain/`)
```python
# Test pure business logic without external dependencies
def test_property_publish_business_rule():
    """Test pure business logic without external dependencies"""
    property_entity = Property(
        id=1,
        title="Test Property",
        price=Money(100000, "KES"),
        location="Test Location"
    )

    property_entity.publish()
    assert property_entity.status == PropertyStatus.PUBLISHED

def test_property_cannot_publish_without_title():
    property_entity = Property(id=1, title="", price=Money(100000), location="Test")

    with pytest.raises(ValueError, match="Cannot publish property without title"):
        property_entity.publish()
```

##### 2. Application Layer Tests (`tests/unit/application/`)
```python
# Test use cases with mocked repositories
@pytest.mark.asyncio
async def test_create_property_use_case():
    # Arrange
    mock_repository = Mock(spec=PropertyRepository)
    mock_repository.create.return_value = Property(
        id=1, title="Test Property", price=Money(100000), location="Test"
    )

    use_case = CreatePropertyUseCase(mock_repository)
    request = PropertyCreateDTO(id=0, title="Test Property", price=100000, location="Test")

    # Act
    result = await use_case.execute(request)

    # Assert
    assert result.id == 1
    assert result.title == "Test Property"
    mock_repository.create.assert_called_once()
```

##### 3. Infrastructure Layer Tests (`tests/integration/infrastructure/`)
```python
# Test repository implementations with test database
@pytest.mark.asyncio
async def test_sqlalchemy_property_repository():
    # Use test database session
    async with test_db_session() as session:
        repository = SqlAlchemyPropertyRepository(session)

        # Test create
        property_entity = Property(id=0, title="Test", price=Money(100000), location="Test")
        saved_entity = await repository.create(property_entity)

        assert saved_entity.id > 0
        assert saved_entity.title == "Test"

        # Test retrieve
        retrieved = await repository.get_by_id(saved_entity.id)
        assert retrieved is not None
        assert retrieved.title == "Test"
```

##### 4. API Layer Tests (`tests/api/`)
```python
# Test HTTP endpoints with test client
@pytest.mark.asyncio
async def test_create_property_endpoint():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/property/",
            json={"id": 0, "title": "Test Property", "price": 100000, "location": "Test"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Test Property"
        assert data["id"] > 0
```

#### Test Organization Patterns

##### Test Fixtures
```python
# tests/conftest.py
@pytest.fixture
async def test_db_session():
    """Provide isolated database session for tests"""
    async with AsyncSession(test_engine) as session:
        yield session
        await session.rollback()

@pytest.fixture
def mock_property_repository():
    """Mock repository for use case tests"""
    return Mock(spec=PropertyRepository)

@pytest.fixture
async def test_property():
    """Test property entity"""
    return Property(
        id=1,
        title="Test Property",
        price=Money(Decimal("100000"), "KES"),
        location="Nairobi, Kenya"
    )
```

##### Test Data Factories
```python
# tests/factories.py
class PropertyFactory:
    @staticmethod
    def create(
        id: int = 1,
        title: str = "Test Property",
        price: Decimal = Decimal("100000"),
        currency: str = "KES",
        location: str = "Nairobi"
    ) -> Property:
        return Property(
            id=id,
            title=title,
            price=Money(price, currency),
            location=location
        )

class PropertyCreateDTOFactory:
    @staticmethod
    def create(id: int = 0, **kwargs) -> PropertyCreateDTO:
        defaults = {
            "title": "Test Property",
            "price": 100000,
            "location": "Nairobi",
            "currency": "KES"
        }
        defaults.update(kwargs)
        return PropertyCreateDTO(id=id, **defaults)
```

#### Test Naming Conventions
```python
# Pattern: test_[action]_[expected_result]_[condition]
def test_create_property_returns_property_with_id_when_valid_data():
    pass

def test_create_property_raises_validation_error_when_invalid_price():
    pass

def test_search_properties_returns_filtered_results_when_criteria_provided():
    pass
```

#### Mocking Guidelines
```python
# ✅ CORRECT: Mock external dependencies
@patch('infrastructure.external_services.payment.stripe_service.create_payment')
async def test_payment_processing(mock_stripe):
    mock_stripe.return_value = {"id": "pi_123", "status": "succeeded"}
    # Test payment use case

# ✅ CORRECT: Mock repository interfaces
def test_use_case_with_mock_repository():
    mock_repo = Mock(spec=PropertyRepository)
    use_case = CreatePropertyUseCase(mock_repo)
    # Test use case logic
```

#### Integration Test Patterns
```python
# Full integration test with dependency injection
@pytest.mark.integration
async def test_property_creation_end_to_end():
    # Setup test container with real implementations
    container = create_test_container()

    # Test complete flow: API -> Use Case -> Repository -> Database
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/v1/property/", json=test_data)

        assert response.status_code == 200

        # Verify in database
        property_id = response.json()["id"]
        saved_property = await container.property_repository().get_by_id(property_id)
        assert saved_property is not None
```

#### Test Coverage Requirements
- Domain layer: 100% coverage (pure business logic)
- Application layer: 95% coverage (use cases)
- Infrastructure layer: 80% coverage (external dependencies)
- API layer: 90% coverage (HTTP handling)

#### Test Performance
- Unit tests: < 10ms each
- Integration tests: < 100ms each
- API tests: < 500ms each
- Use async/await for all async code tests

### File Organization
- **Domain-based folders**: Group by business domain
- **Clear naming**: Descriptive, consistent conventions
- **Export patterns**: Named exports, default objects
- **Import order**: External → Internal → Relative

### Performance Standards
- **Bundle Size**: Monitor and optimize splits
- **Loading States**: Skeleton components, progressive loading
- **Caching**: Appropriate stale times per data type
- **Images**: Optimize formats and sizes

---

## Security & Best Practices

### Authentication & Authorization
- **JWT Tokens**: Secure storage, automatic refresh
- **Role-based Access**: Admin vs user permissions
- **API Security**: Input validation, rate limiting
- **Session Management**: Proper logout and cleanup

### Data Validation
- **Client-side**: User experience and early feedback
- **Server-side**: Security and data integrity
- **Schema Validation**: Zod for TypeScript, Pydantic for Python
- **Error Mapping**: Consistent error formats

### Privacy & Compliance
- **Data Minimization**: Only collect necessary data
- **Secure Storage**: Encrypted sensitive information
- **Audit Logs**: Track admin actions
- **GDPR Compliance**: User data rights

---

## Domain-Specific Guidelines

### Property Listings
- **Search**: Complex filtering with location, price, type
- **Details**: Rich media galleries, virtual tours
- **Contact**: Lead generation and inquiry management

### Investment Platform
- **Products**: Financial instruments, risk profiles
- **KYC**: Identity verification workflows
- **Portfolio**: Investment tracking and analytics

### Short-term Rentals (BnB)
- **Availability**: Calendar-based booking system
- **Reviews**: User feedback and rating system
- **Payments**: Secure transaction processing

### Tours & Experiences
- **Packages**: Multi-day itineraries with pricing
- **Bookings**: Group size and date management
- **Guides**: Service provider profiles

### Vehicle Rentals
- **Fleet**: Vehicle availability and specifications
- **Reservations**: Date range and location pickup
- **Insurance**: Coverage options and requirements

---

## Quick Reference Commands

### Backend Development
```bash
# Start backend server
cd app && uvicorn main:app --reload

# Run tests
cd app && python -m pytest

# Database migrations
cd app && alembic upgrade head
```

### Frontend Development
```bash
# Start frontend dev server
cd frontend && npm start

# Build for production
cd frontend && npm run build

# Run tests
cd frontend && npm test
```

### Admin Development
```bash
# Start admin dev server
cd admin && npm start

# Build admin interface
cd admin && npm run build
```

---

## Common Patterns & Examples

### Creating New Features

1. **Backend**: Domain entity → Use case → API route
2. **Frontend**: Service → Hook → Component
3. **Admin**: Admin service → Admin hook → Admin component

### Data Flow Example (Property Search)
```
1. User types in search → PropertySearch component
2. Component calls useSearchProperties hook
3. Hook calls searchProperties service
4. Service makes POST /api/v1/property/search
5. Backend validates → Use case → Repository → Database
6. Response cached in React Query
7. Component renders PropertyGrid with results
```

### Error Handling Example
```
1. API returns 400 with validation errors
2. Service throws error with structured format
3. Hook catches and formats for UI
4. Component displays inline field errors
5. User corrects input and retries
```

This comprehensive guide serves as the central reference for all development activities within the Buckler Investments Group platform. Always refer to this document for architectural decisions, coding standards, and implementation patterns.
