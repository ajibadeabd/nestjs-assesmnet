import { PlansService } from './subscription.service';
import { UserService } from '../user/user.service';
import { BrokerService } from '../message-broker/message.service';
import { SubscriptionDataFactory } from '../databaseFactory/subscription.factory';

describe('PlansService', () => {
  let plansService: PlansService;
  let subscriptionDataFactory: SubscriptionDataFactory;
  let userService: UserService;
  let brokerService: BrokerService;

  beforeEach(() => {
    subscriptionDataFactory = {
      createSubscriptionAndUsage: jest.fn(),
    } as any;

    userService = {
      getUserSubscriptionWithPlan: jest.fn(),
    } as any;

    brokerService = {
      processBilling: jest.fn(),
    } as any;

    plansService = new PlansService(
      subscriptionDataFactory,
      userService,
      brokerService,
    );
  });

  describe('getAvailablePlans', () => {
    it('should retrieve available plans', async () => {
      const result = await plansService.getAvailablePlans();

      expect(result.length).toBeGreaterThan(1);
    });
  });

  // describe('billUser', () => {
  //   it('should bill a user', async () => {
  //     const mockUserId = 'user123';

  //     const mockSubscriptionResponse = {
  //       // ... mock subscription response
  //     };

  //     userService.getUserSubscriptionWithPlan.mockResolvedValue(
  //       mockSubscriptionResponse,
  //     );

  //     await plansService.billUser(mockUserId);

  //     expect(userService.getUserSubscriptionWithPlan).toHaveBeenCalledWith({
  //       userId: mockUserId,
  //     });
  //     expect(brokerService.processBilling).toHaveBeenCalledWith(
  //       mockSubscriptionResponse,
  //     );
  //   });
  // });

  // describe('createSubscription', () => {
  //   it('should create a subscription', async () => {
  //     const mockPlanId = 1;
  //     const mockUser = {
  //       id: 'user123',
  //       email: 'user@example.com',
  //     };

  //     const mockChosenPlan = {
  //       // ... mock chosen plan
  //     };

  //     const mockRenewalAndExpiration = {
  //       // ... mock renewal and expiration dates
  //     };

  //     const mockNewPlan = {
  //       // ... mock new plan
  //     };

  //     const mockUsageDetails = {
  //       // ... mock usage details
  //     };

  //     const mockResponse = {
  //       // ... mock response
  //     };

  //     jest.spyOn(plansService, 'getPlans').mockReturnValue([mockChosenPlan]);
  //     jest
  //       .spyOn(plansService, 'calculateRenewalAndExpiration')
  //       .mockReturnValue(mockRenewalAndExpiration);
  //     jest
  //       .spyOn(subscriptionDataFactory, 'createSubscriptionAndUsage')
  //       .mockResolvedValue(mockResponse);

  //     const result = await plansService.createSubscription(
  //       mockPlanId,
  //       mockUser,
  //     );

  //     expect(plansService.getPlans).toHaveBeenCalled();
  //     expect(plansService.calculateRenewalAndExpiration).toHaveBeenCalledWith(
  //       mockChosenPlan.payment_frequency,
  //       expect.any(Date),
  //     );
  //     expect(
  //       subscriptionDataFactory.createSubscriptionAndUsage,
  //     ).toHaveBeenCalledWith(mockNewPlan, mockUsageDetails);
  //     expect(result).toEqual(mockResponse);
  //   });

  //   it('should throw error for invalid plan selection', async () => {
  //     const mockPlanId = 99;
  //     const mockUser = {
  //       id: 'user123',
  //       email: 'user@example.com',
  //     };

  //     jest.spyOn(plansService, 'getPlans').mockReturnValue([]);

  //     await expect(
  //       plansService.createSubscription(mockPlanId, mockUser),
  //     ).rejects.toThrow('Invalid plan selection');
  //   });

  //   it('should handle error during subscription creation', async () => {
  //     const mockPlanId = 1;
  //     const mockUser = {
  //       id: 'user123',
  //       email: 'user@example.com',
  //     };

  //     jest.spyOn(plansService, 'getPlans').mockReturnValue([{ id: '1' }]);
  //     jest
  //       .spyOn(plansService, 'calculateRenewalAndExpiration')
  //       .mockReturnValue({});
  //     jest
  //       .spyOn(subscriptionDataFactory, 'createSubscriptionAndUsage')
  //       .mockRejectedValue(new Error('Some error'));

  //     await expect(
  //       plansService.createSubscription(mockPlanId, mockUser),
  //     ).rejects.toThrow('Some error');
  //   });
  // });

  // ... other test cases
});
